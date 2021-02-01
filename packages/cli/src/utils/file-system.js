import fs from "fs";
import path from "path";

/* FileSystem class for utility methods for doing file system operations */
export class FileSystem {

    /* read a json file into memory */
    static readJSON(filename) {
        return JSON.parse(fs.readFileSync(filename));
    }

    /* write a json object to the disk */
    static writeJSON(filename, data) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

    /* create a directory */
    static createDirectory(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    /* reads a directory and gets a list of the contents */
    static readDirectory(directory) {
        return fs.readdirSync(directory);
    }

    /* deletes a directory and all subdirectories and files */
    static deleteDirectory(directory) {
        if (fs.existsSync(directory)) {
            const files = FileSystem.readDirectory(directory);

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