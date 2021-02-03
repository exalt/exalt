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
}