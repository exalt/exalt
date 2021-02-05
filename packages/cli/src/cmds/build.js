import { loadConfig, loadToolchain } from "../utils/config";
import { logError } from "../utils/logging";

/* build the project for production */
export default async function build(args) {
    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);

        toolchain.build(Object.assign(toolchain.defaultOptions, config.toolchainOptions ?? {}, args));

    } catch (error) {
        logError(error.message);
    }
}