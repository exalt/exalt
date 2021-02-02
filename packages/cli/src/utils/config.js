import { FileSystem } from "./file-system";
import path from "path";
import fs from "fs";

export class Config {

    /* load the config file from the root of the project */
    static loadConfig() {
        try {
            return FileSystem.readJSON(path.join(process.cwd(), "exalt.json"));
        } catch {
            return null;
        }
    }

    /* validate the config, ensuring that all required fields are present */
    static validateConfig(config) {
        const requiredKeys = ["name", "input", "toolchain", "platform"];

        for (let key of requiredKeys) {
            if (config[key] == undefined) {
                return false;
            }
        }

        return true;
    }

    /* load the toolchain specified in the config file */
    static loadToolchain(config) {
        const toolchain = FileSystem.isFilePath(config.toolchain) ? path.join(process.cwd(), config.toolchain) : config.toolchain;
        const toolchainPath = (path.isAbsolute(toolchain)) ? toolchain : path.join(process.cwd(), "node_modules", toolchain);

        if (config.toolchain && fs.existsSync(toolchainPath)) {
            return import(require.resolve(toolchain, { path: [process.cwd()] }));
        } else {
            return null;
        }
    }
}