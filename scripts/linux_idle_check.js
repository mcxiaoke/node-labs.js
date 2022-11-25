import { execa } from 'execa';
import fs from 'fs-extra';

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

async function smbActive() {
    try {
        const { stdout } = await execa("/usr/bin/smbstatus", ["-S"]);
        console.log(stdout);
        return stdout && stdout.includes(":");
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function sshActive() {
    try {
        // shell command, use exec, execFile not working
        const { stdout } = await execa("/usr/bin/w", ["-h", "-s", "-i"]);
        console.log(stdout);
        return stdout && stdout.includes("pts/");
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function main() {
    // const smb = await smbActive();
    // console.log(`smbActive=${smb}`);
    // const ssh = await sshActive();
    // console.log(`sshActive=${ssh}`);
    // get idle time from /dev/pts/x stat access time
    let pts = await fs.readdir('/dev/pts/');
    pts = pts.filter(x => isNumeric(x));
    console.log(pts);
    for (const p in pts) {
        console.log(p)
        const pstat = await fs.stat(`/dev/pts/${p}`);
        console.log(pstat.atime);
    }


}

main();