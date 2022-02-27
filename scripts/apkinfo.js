const { Apk } = require("node-apk");
const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const cconv = require("chinese-conv");
const iconv = require("iconv-lite");
const { createHash } = require("crypto");

function sha256Hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

function hash(string) {
  return sha256Hash(string).substring(0, 8);
}

const REGEX_UNICODE_HAN_ANY = /[\p{sc=Hani}]/u;
const strHasHani = (str) => REGEX_UNICODE_HAN_ANY.test(str);

const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
const utf8ToHex = convert("utf8", "hex");
const hexToUtf8 = convert("hex", "utf8");

function extractLabel(manifest, resources) {
  let label = manifest.applicationLabel;
  if (typeof label !== "string") {
    let all = resources.resolve(label);
    // console.log("aaa", all.length, all);
    if (all && all.length > 0) {
      while (typeof all[0].value === "number") {
        // console.log("bbb", all.length, all);
        // id @ reference, resolve util end
        all = resources.resolve(all[0].value);
      }
      const lbo = {};
      all &&
        all.forEach((it) => {
          lbo[
            it.locale ? it.locale.language + (it.locale.country || "") : "enUS"
          ] = it.value;
        });
      // console.log(lbo);
      label =
        lbo["zhCN"] || lbo["zh"] || lbo["zhHK"] || lbo["zhTW"] || lbo["enUS"];

      const dlbl = lbo["enUS"];
      if (label !== dlbl) {
        label += `(${dlbl})`;
      }
      if (strHasHani(label)) {
        label = cconv.sify(label);
      }
    }

    // console.log(typeof label, label);
  }
  return label || "Noname";
}

async function parseOne(apkfile, normalizeName = false) {
  const exists = await fs.pathExists(apkfile);
  if (!exists) {
    console.log("Failed to open file:", path.resolve(apkfile));
    return;
  }
  const apkDir = path.dirname(apkfile);
  const apkName = path.basename(apkfile);
  console.log("SRC:" + apkfile);
  //   const file = path.basename(apkfile);
  const apk = new Apk(apkfile);
  try {
    const manifest = await apk.getManifestInfo();
    const resources = await apk.getResources();
    const certs = await apk.getCertificateInfo();
    let label = extractLabel(manifest, resources) || "Noname";
    // console.log(typeof label, label);
    label = label.replace(/[\s:\/\\]+/g, "");
    // console.log(`package = ${manifest.package}`);
    // console.log(`versionCode = ${manifest.versionCode}`);
    // console.log(`versionName = ${manifest.versionName}`);
    // console.log(`label = ${label}`);
    let newName = `${label}-${manifest.versionName || "0.0"}-${
      manifest.versionCode
    }-${manifest.package}`;
    try {
      // console.log(util.inspect(certs));
      // certs.forEach((cert) => {
      // console.log(`serial = ${cert.serial}`);
      // console.log(`subject = ${cert.subject.values()}`);
      // console.log(`issuer = ${iconv.decode(cert.issuer.get("CN"), "utf8")}`);
      // console.log(`subject = ${iconv.decode(cert.subject.get("CN"), "utf8")}`);
      //   console.log(`validUntil = ${cert.validUntil}`);
      //   // console.log(cert.bytes.toString("base64"));
      // });
      const cert = certs[0];
      let issuer, subject;
      if (cert.issuer && cert.issuer.get("CN")) {
        issuer = Buffer.from(cert.issuer.get("CN"), "binary").toString("utf8");
        subject = Buffer.from(cert.subject.get("CN"), "binary").toString(
          "utf8"
        );
      } else {
        issuer = cert.serial;
        // no CN, use serial
        if (issuer === "47723c30") {
          issuer = "modyolo.com";
        }
        // subject = hash(cert.bytes);
      }

      if (issuer) {
        if (subject && issuer !== subject) {
          const sign = issuer
            ? `${issuer.split(" ")[0]}-${subject.split(" ")[0]}`
            : ``;
          newName = `${label}[${sign}]-${manifest.versionName || "0.0"}-${
            manifest.versionCode
          }-${manifest.package}`;
        } else {
          newName = `${label}[${issuer.split(" ")[0]}]-${
            manifest.versionName || "0.0"
          }-${manifest.versionCode}-${manifest.package}`;
        }
      }
    } catch (e) {
      console.log("No certs found: " + apkName);
    }
    newName += ".apk";
    const newPath = path.join(apkDir, newName);
    console.log("DST:" + newPath);
    if (normalizeName) {
      if (newName !== apkName && !(await fs.pathExists(newPath))) {
        console.log(`Rename ${newName}`);
        await fs.move(apkfile, newPath);
      } else {
        console.log("Skip " + apkfile);
      }
    }
    return {
      file: apkfile,
      name: apkName,
      dir: apkDir,
      label: label,
      package: manifest.package,
      versionCode: manifest.versionCode,
      versionName: manifest.versionName,
      manifest: manifest,
      certs: certs,
    };
  } catch (e) {
    console.error(e);

    const newPath = path.join(apkDir, "error", apkName);
    console.log(`Error ${apkfile}`);
    // await fs.move(apkfile, newPath);
  } finally {
    apk.close();
  }
}

async function renameAll(input, rename = false) {}

async function main() {
  const argv = process.argv.slice(2);
  const input = argv[0] || "";
  const doRename = argv[1] && argv[1] === "-r";
  if (!input) {
    console.log("Error: no input");
    return;
  }
  const exists = await fs.pathExists(input);
  if (!exists) {
    console.log("Failed to open file:", path.resolve(input));
    return;
  }
  let folder = input;
  let files = [];
  const lstat = await fs.lstat(input);
  if (lstat.isFile()) {
    folder = path.dirname(input);
    files.push(input);
  } else if (lstat.isDirectory()) {
    files = await fs.readdir(input);
    files = files.map((it) => path.join(input, it));
  }
  files = files.filter((it) => it.toLowerCase().endsWith(".apk"));
  let results = [];
  for (const file of files) {
    const r = await parseOne(file, doRename);
    r && results.push(r);
  }
  results.sort((a, b) => {
    if (a.package < b.package) {
      return -1;
    } else if (a.package > b.package) {
      return 1;
    } else {
      return 0;
    }
  });
  const content = results.map((it) => `${it.label} | ${it.package}`).join("\n");
  await fs.writeFile(path.join(folder, "apps.txt"), content);
}

main();
