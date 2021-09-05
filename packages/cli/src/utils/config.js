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

    /* load the toolchain using the node resolution algorithm */
    const toolchainModule = await import(require.resolve(toolchain, { paths: [process.cwd()] }));
    return toolchainModule.default;
}

/* load the options from the config */
export function loadOptions(config, args) {
    const toolchainOptions = config.toolchainOptions ?? {};
    
    return {
        name: config.name,
        input: config.input,
        toolchainOptions: { ...toolchainOptions, ...args }
    };
}