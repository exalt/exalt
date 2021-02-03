import { FileSystem } from "./file-system";
import path from "path";
import fs from "fs";

/* Template class for generating project templates and updating placeholder data */
export class Template {

    /* create a project from a template */
    static create(src, dest, filter = {}, templateValues = {}) {
        const filesToCreate = fs.readdirSync(src);

        for (let file of filesToCreate) {
            const originalPath = path.join(src, file);

            if (filter[file]) file = filter[file];

            if (file.endsWith(".template")) file = file.replace(/.template$/, "");

            const newPath = path.join(dest, file);
            const stats = fs.statSync(originalPath);

            if (stats.isFile()) {
                if (path.extname(originalPath) == ".template") {
                    const content = Template.render(fs.readFileSync(originalPath, "utf8"), templateValues);
                    fs.writeFileSync(newPath, content);
                } else {
                    fs.writeFileSync(newPath, fs.readFileSync(originalPath));
                }
            } else if (stats.isDirectory()) {
                FileSystem.createDirectory(newPath);
                Template.create(originalPath, newPath, filter, templateValues);
            }
        }
    }

    /* render data into the template placeholders */
    static render(content, values) {
        const keys = Object.keys(values);

        for (let key of keys) {
            content = content.replace(new RegExp(`{{${key}}}`, "g"), values[key]);
        }

        return content;
    }
}