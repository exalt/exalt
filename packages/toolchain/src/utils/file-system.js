import fs from "fs";
import path from "path";

/* copy assets to the build folder */
export function copyAssets(src, dest, copyOnce = false) {
    const filesToCreate = fs.readdirSync(src);

    for (let file of filesToCreate) {
        if(file ==  "index.html") continue;

        const originalPath = path.join(src, file);
        const newPath = path.join(dest, file);
        const stats = fs.statSync(originalPath);

        if (stats.isFile()) {
            fs.writeFileSync(newPath, fs.readFileSync(originalPath));
        } else if (stats.isDirectory()) {
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath, { recursive: true });
            }
            copyAssets(originalPath, newPath, copyOnce);
        }
    }
}