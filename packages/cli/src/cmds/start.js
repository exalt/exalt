import { loadConfig, loadToolchain } from "../utils/config";
import { logError } from "../utils/logging";

/* starts the application in production mode */
export default async function start(args) {
    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const toolchainOptions = Object.assign(toolchain.defaultOptions, config.toolchainOptions ?? {}, args);

        toolchain.start(toolchainOptions);

    } catch (error) {
        logError(error.message);
    }
}