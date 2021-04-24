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
            throw new Error(`Config validation failed, missing the required "${key}" property.`);
        }
    }

    return config;
}

/* load the toolchain specified in the config file */
export async function loadToolchain(config) {

    /* checks if a given filepath is valid without attempting to load it */
    const isFilePath = (filepath) => {
        return (filepath.includes("/") && !filepath.startsWith("@"));
    };

    const toolchain = isFilePath(config.toolchain) ? path.join(process.cwd(), config.toolchain) : config.toolchain;

    if (config.toolchain) {
        const toolchainModule = await import(require.resolve(toolchain, { paths: module.paths }));
        return toolchainModule.default;

    } else {
        throw new Error("Unable to find the toolchain specified in exalt.json");
    }
}

/* load the options from the config */
export function loadOptions(config, args) {
    const configOptions = {
        name: config.name,
        input: config.input,
        format: "iife", /* will be dynamically changed by the platform api */
        dest: (process.env.NODE_ENV == "production") ? "dist/app" : ".exalt/app" /* will be dynamically changed by the platform api */
    };

    const toolchainOptions = config.toolchainOptions ?? {};

    return {
        config: configOptions,
        options: { ...toolchainOptions, ...args }
    };
}