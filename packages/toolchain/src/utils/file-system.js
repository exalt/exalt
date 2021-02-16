import fs from "fs";
import path from "path";

/* copy assets to another folder */
export function copyAssets(src, dest) {
    const filesToCreate = fs.readdirSync(src);

    for (let file of filesToCreate) {
        if (file.endsWith(".html")) continue;

        const originalPath = path.join(src, file);
        const newPath = path.join(dest, file);
        const stats = fs.statSync(originalPath);

        if (stats.isFile()) {
            fs.writeFileSync(newPath, fs.readFileSync(originalPath));
        } else if (stats.isDirectory()) {
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath, { recursive: true });
            }
            copyAssets(originalPath, newPath);
        }
    }

    copyFile("exalt.json", ".exalt", { "exalt.json": "cache.json" });
}

/* copy files to another folder */
export function copyFile(file, dest, filter = {}) {
    let newFile = file;
    if (filter[file]) newFile = filter[file];

    const stats = fs.statSync(file);

    if (stats.isFile()) {
        fs.writeFileSync(path.join(dest, newFile), fs.readFileSync(file));
    }
}