import { Config } from "../utils/config";

export default async function build(args) {
    try {
        const config = Config.loadConfig();

        if (!Config.validateConfig(config)) {
            console.error(`Validation failed on "exalt.json", ensure required fields are present in your config`);
            return;
        }

        const toolchain = await Config.loadToolchain(config);

        if (!toolchain) {
            console.error(`ERROR: Unable to find the toolchain specified in "exalt.json"`);
            return;
        }

        toolchain.build(Object.assign(toolchain.defaultOptions, config.toolchainOptions ?? {}, args));
    } catch (error) {
        console.error(error.message);
    }
}