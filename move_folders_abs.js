const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const srcBase = path.join(rootDir, 'frontend', 'app', 'dashboard');
const destBase = path.join(rootDir, 'frontend', 'app', '(roles)', 'student', 'dashboard');

console.log('Source Base:', srcBase);
console.log('Dest Base:', destBase);

if (!fs.existsSync(destBase)) {
    console.error('Destination base does not exist!');
    process.exit(1);
}

console.log('Initial Dest Content:', fs.readdirSync(destBase));

['dbms', 'dld'].forEach(folder => {
    const src = path.join(srcBase, folder);
    const dest = path.join(destBase, folder);

    if (fs.existsSync(src)) {
        console.log(`Moving ${folder}...`);
        try {
            fs.cpSync(src, dest, { recursive: true });
            console.log(`Copied ${folder} to ${dest}`);
            // Check if copy worked
            if (fs.existsSync(dest)) {
                fs.rmSync(src, { recursive: true, force: true });
                console.log(`Removed source ${src}`);
            } else {
                console.error(`Copy failed for ${folder}, not removing source.`);
            }
        } catch (e) {
            console.error(`Error processing ${folder}:`, e);
        }
    } else {
        console.log(`Source ${src} not found.`);
    }
});

console.log('Final Dest Content:', fs.readdirSync(destBase));
