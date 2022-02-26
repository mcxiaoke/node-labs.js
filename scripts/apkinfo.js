const { Apk } = require("node-apk");
const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const iconv = require("iconv-lite");

const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
const utf8ToHex = convert("utf8", "hex");
const hexToUtf8 = convert("hex", "utf8");

function extractLabel(manifest, resources) {
  let label = manifest.applicationLabel;
  if (typeof label !== "string") {
    let all = resources.resolve(label);
    // (typeof all[0].value === "string" && all[0].value.startsWith("@"))
    while (all.length === 1 && typeof all[0].value === "number") {
      // resource id reference, resolve util end
      all = resources.resolve(all[0].value);
    }
    // console.log(all, all.length);
    const defaultLabel = all[0].value;
    label = (
      all.find((res) => res.locale && res.locale.language === "zh") || all[0]
    ).value;
    if (label !== defaultLabel) {
      label += `(${defaultLabel})`;
    }
    // console.log(typeof label, label);
    // all.forEach((it) => {
    //   it.locale && console.log(it.value, it.locale, util.inspect(it.locale));
    // });
  }
  return label;
}

async function parseOne(apkfile, normalizeName = true) {
  const exists = await fs.pathExists(apkfile);
  if (!exists) {
    console.log("Failed to open file:", path.resolve(apkfile));
    return;
  }
  const apkDir = path.dirname(apkfile);
  const apkName = path.basename(apkfile);
  // console.log(apkfile);
  //   const file = path.basename(apkfile);
  const apk = new Apk(apkfile);
  try {
    const manifest = await apk.getManifestInfo();
    const resources = await apk.getResources();
    const certs = await apk.getCertificateInfo();
    const label = extractLabel(manifest, resources);
    // console.log(`package = ${manifest.package}`);
    // console.log(`versionCode = ${manifest.versionCode}`);
    // console.log(`versionName = ${manifest.versionName}`);
    // console.log(`label = ${label}`);
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
    if (cert.issuer.get("CN")) {
      issuer = Buffer.from(cert.issuer.get("CN"), "binary").toString("utf8");
      subject = Buffer.from(cert.subject.get("CN"), "binary").toString("utf8");
    } else {
      issuer = null;
      subject = null;
    }

    let newName = `${label}-${manifest.versionName}-${manifest.versionCode}-${manifest.package}`;
    if (issuer) {
      if (issuer !== subject) {
        const sign = issuer
          ? `${issuer.split(" ")[0]}${subject.split(" ")[0]}`
          : ``;
        newName += `-by${sign}`;
      } else {
        newName += `-by${issuer.split(" ")[0]}`;
      }
    }
    newName += ".apk";
    const newPath = path.join(apkDir, newName);
    // console.log(newName);
    if (normalizeName) {
      if (newName !== apkName && !(await fs.pathExists(newPath))) {
        console.log(`Rename ${newName}`);
        await fs.move(apkfile, newPath);
      } else {
        console.log("Skip " + apkfile);
      }
    }
  } catch (e) {
    console.error(e.toString());
    const newPath = path.join(apkDir, "error", apkName);
    console.log(`Error ${newPath}`);
    await fs.move(apkfile, newPath);
  } finally {
    apk.close();
  }
}

async function main() {
  const input = process.argv.slice(2)[0];
  if (!input) {
    console.log("Error: no input");
    return;
  }
  const exists = await fs.pathExists(input);
  if (!exists) {
    console.log("Failed to open file:", path.resolve(input));
    return;
  }
  let files = [];
  const lstat = await fs.lstat(input);
  if (lstat.isFile()) {
    files.push(input);
  } else if (lstat.isDirectory()) {
    files = await fs.readdir(input);
    files = files.map((it) => path.join(input, it));
  }
  files = files.filter((it) => it.toLowerCase().endsWith(".apk"));
  for (const file of files) {
    await parseOne(file);
  }
}

main();
