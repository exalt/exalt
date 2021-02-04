import fs from "fs";
import path from "path";

/* FileSystem class for utility methods for doing file system operations */
export class FileSystem {

    /* create a directory */
    static createDirectory(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    /* deletes a directory and all subdirectories and files */
    static deleteDirectory(directory) {
        if (fs.existsSync(directory)) {
            const files = fs.readdirSync(directory);

            for (let file of files) {
                const filepath = path.join(directory, file);

                if (fs.statSync(filepath).isDirectory()) {
                    FileSystem.deleteDirectory(filepath);
                } else {
                    fs.unlinkSync(filepath);
                }
            }

            fs.rmdirSync(directory);
        }
    }

    /* checks if a given filepath is valid without attempting to load it */
    static isFilePath(filepath) {
        return (filepath.includes("/") && !filepath.startsWith("@"));
    }

    /* copy a template into the desired destination */
    static copyTemplate(src, dest, values = {}) {
        const filesToCreate = fs.readdirSync(src);

        /* render the data into the templates */
        const render = (content) => {
            const keys = Object.keys(values);

            for (let key of keys) {
                content = content.replace(new RegExp(`{{${key}}}`, "g"), values[key]);
            }

            return content;
        };

        for (let file of filesToCreate) {
            const originalPath = path.join(src, file);

            if (file.endsWith(".template")) {
                file = file.replace(/.template$/, "");
            }

            const newPath = path.join(dest, file);
            const stats = fs.statSync(originalPath);

            if (stats.isFile()) {
                if (path.extname(originalPath) == ".template") {
                    fs.writeFileSync(newPath, render(fs.readFileSync(originalPath, "utf8")));
                } else {
                    fs.writeFileSync(newPath, fs.readFileSync(originalPath));
                }
            } else if (stats.isDirectory()) {
                FileSystem.createDirectory(newPath);
                FileSystem.copyTemplate(originalPath, newPath, values);
            }
        }
    }
}