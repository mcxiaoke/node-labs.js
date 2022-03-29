const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs-extra");
const { execFile } = require("child_process");
const util = require("util");

const binary = "wallpaper.exe";
const baseDir = "C:\\Users\\login\\Pictures\\AutoWallpaper";
const execFileP = util.promisify(execFile);

async function getWallpaper() {
  const { stdout } = await execFileP(binary);
  return stdout.trim();
}

async function setWallpaper(imagePath) {
  await execFileP(binary, [path.resolve(imagePath)]);
}

async function test() {
  const argv = process.argv.slice(2);
  console.log(argv);
  if (argv && argv.length > 0 && (await fs.pathExists(argv[0]))) {
    await setWallpaper(path.resolve(argv[0]));
  } else {
    console.log(
      `Usage: node ${path.basename(process.argv[1])} your-wallpaper-image-path`
    );
  }
}

async function main() {
  const config = require(path.join(baseDir, "wallpaper.json"));
  const now = dayjs();
  const imageName =
    now.hour() < config.fromHour || now.hour() > config.toHour
      ? config.dark
      : config.light;
  console.log(imageName);
  const imagePath = path.resolve(path.join(baseDir, imageName));
  const oldPath = await getWallpaper();
  console.log(`Wallpaper is ${oldPath}`);
  if (imagePath !== oldPath) {
    await setWallpaper(imagePath);
    console.log(`Result: changed to ${imagePath}`);
  } else {
    console.log("Result: not changed");
  }
}

main();
