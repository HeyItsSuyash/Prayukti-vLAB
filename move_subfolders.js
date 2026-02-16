const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            copyRecursiveSync(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const root = process.cwd();
const srcBase = path.join(root, 'frontend/app/dashboard');
const destBase = path.join(root, 'frontend/app/(roles)/student/dashboard');

['dbms', 'dld'].forEach(lab => {
    const srcDir = path.join(srcBase, lab);
    const destDir = path.join(destBase, lab);

    if (fs.existsSync(srcDir)) {
        console.log(`Moving subfolders of ${lab}...`);
        fs.readdirSync(srcDir).forEach(item => {
            if (item === 'page.tsx') return; // Skip the subject list page as it was manually recreated

            const srcItem = path.join(srcDir, item);
            const destItem = path.join(destDir, item);

            console.log(`Copying ${item} to ${destDir}...`);
            copyRecursiveSync(srcItem, destItem);

            if (fs.existsSync(destItem)) {
                console.log(`Successfully moved ${item}. Removing source.`);
                fs.rmSync(srcItem, { recursive: true, force: true });
            }
        });
    }
});
