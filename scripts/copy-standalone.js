const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;

    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log('Starting standalone asset copy...');

    // cp -r .next/static .next/standalone/.next/
    // Result should be .next/standalone/.next/static
    const staticSrc = path.join('.next', 'static');
    // Ensure parent dir exists
    const staticDest = path.join('.next', 'standalone', '.next', 'static');

    // We pass staticDest as the destination folder for the CONTENTS of staticSrc? 
    // Wait, cp -r src dest: if dest exists, it puts src INSIDE dest. 
    // If dest doesn't exist, it copies src AS dest.
    // My copyDir takes (src, dest) and copies CONTENT of src to dest.
    // So to mimic cp -r .next/static .next/standalone/.next/ (where .next/standalone/.next usually exists),
    // we want .next/standalone/.next/static to be populated.

    if (fs.existsSync(staticSrc)) {
        copyDir(staticSrc, staticDest);
        console.log(`Copied ${staticSrc} to ${staticDest}`);
    } else {
        console.log(`Source ${staticSrc} not found, skipping.`);
    }

    // cp -r public .next/standalone/
    const publicSrc = 'public';
    const publicDest = path.join('.next', 'standalone', 'public');

    if (fs.existsSync(publicSrc)) {
        copyDir(publicSrc, publicDest);
        console.log(`Copied ${publicSrc} to ${publicDest}`);
    } else {
        console.log(`Source ${publicSrc} not found, skipping.`);
    }

    console.log('Standalone asset copy complete.');
} catch (error) {
    console.error('Error copying assets:', error);
    process.exit(1);
}
