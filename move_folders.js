const fs = require('fs');
const path = require('path');

const srcBase = path.join(__dirname, 'frontend/app/dashboard');
const destBase = path.join(__dirname, 'frontend/app/(roles)/student/dashboard');

const folders = ['dbms', 'dld'];

folders.forEach(folder => {
    const src = path.join(srcBase, folder);
    const dest = path.join(destBase, folder);

    if (fs.existsSync(src)) {
        console.log(`Moving ${folder}...`);
        try {
            fs.cpSync(src, dest, { recursive: true });
            fs.rmSync(src, { recursive: true, force: true });
            console.log(`Successfully moved ${folder}`);
        } catch (e) {
            console.error(`Error moving ${folder}:`, e.message);
        }
    } else {
        console.log(`${folder} not found in source.`);
        if (fs.existsSync(dest)) {
            console.log(`${folder} already exists in destination.`);
        }
    }
});
