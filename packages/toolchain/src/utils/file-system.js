import fs from "fs";
import path from "path";

/* copy folder to another folder */
export function copyFolder(src, dest) {
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
            copyFolder(originalPath, newPath);
        }
    }
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

/* copy the project assets to the build directory */
export function copyAssets(src, dest) {
    copyFolder(src, dest);

    const fragments = dest.split("/");
    fragments.pop();
    
    copyFile("exalt.json", fragments.join("/"));
}