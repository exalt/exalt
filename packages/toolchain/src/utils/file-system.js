import fs from "fs";
import path from "path";

/* copy a folder to another folder */
export function copyFolder(src, dest, copyOnce = false) {
    const filesToCreate = fs.readdirSync(src);

    for (let file of filesToCreate) {
        const originalPath = path.join(src, file);
        const newPath = path.join(dest, file);
        const stats = fs.statSync(originalPath);

        if (originalPath == "public/index.html") continue;

        if (stats.isFile()) {
            if (copyOnce && fs.existsSync(newPath)) continue;
            fs.writeFileSync(newPath, fs.readFileSync(originalPath));
        } else if (stats.isDirectory()) {
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath, { recursive: true });
            }
            copyFolder(originalPath, newPath, copyOnce);
        }
    }
}