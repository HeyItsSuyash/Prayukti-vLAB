const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const rootDir = process.cwd();
const srcBase = path.join(rootDir, 'frontend', 'app', 'dashboard');
const destBase = path.join(rootDir, 'frontend', 'app', '(roles)', 'student', 'dashboard');

['dbms', 'dld'].forEach(lab => {
    const src = path.join(srcBase, lab);
    const dest = path.join(destBase, lab);
    if (fs.existsSync(src)) {
        console.log(`Copying ${lab}...`);
        copyRecursiveSync(src, dest);
        console.log(`Verifying ${lab}...`);
        if (fs.existsSync(dest)) {
            console.log(`Success: ${lab} is at ${dest}`);
        }
    } else {
        console.log(`Source for ${lab} not found at ${src}`);
    }
});
