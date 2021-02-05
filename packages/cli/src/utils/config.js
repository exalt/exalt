import path from "path";
import fs from "fs";

/* load the config file from the root of the project */
export function loadConfig() {
    const requiredKeys = ["name", "input", "toolchain"];
    let config;

    try {
        config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "exalt.json")));
    } catch {
        throw new Error("This command can only be run inside an exalt project.");
    }

    /* validate the config */
    for (let key of requiredKeys) {
        if (config[key] == undefined) {
            throw new Error(`Config validtion failed, ensure required fields are present.`);
        }
    }

    return config;
}

/* load the toolchain specified in the config file */
export function loadToolchain(config) {

    /* checks if a given filepath is valid without attempting to load it */
    const isFilePath = (filepath) => {
        return (filepath.includes("/") && !filepath.startsWith("@"));
    };

    const toolchain = isFilePath(config.toolchain) ? path.join(process.cwd(), config.toolchain) : config.toolchain;
    const toolchainPath = (path.isAbsolute(toolchain)) ? toolchain : path.join(process.cwd(), "node_modules", toolchain);
    if (config.toolchain && fs.existsSync(toolchainPath)) {
        return import(require.resolve(toolchain, { paths: [process.cwd()] }));
    } else {
        throw new Error("Unable to find the toolchain specified in exalt.json");
    }
}