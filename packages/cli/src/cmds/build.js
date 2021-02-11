import { loadConfig, loadToolchain } from "../utils/config";
import { logError } from "../utils/logging";

/* build the project for production */
export default async function build(args) {
    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const toolchainOptions = Object.assign(toolchain.defaultOptions, config, config.toolchainOptions ?? {}, args);

        toolchain.build(toolchainOptions);

    } catch (error) {
        logError(error.message);
    }
}