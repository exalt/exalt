import { loadConfig, loadToolchain } from "../utils/config";
import { logError } from "../utils/logging";

/* starts the application in development mode */
export default async function serve(args) {
    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const toolchainOptions = Object.assign(toolchain.defaultOptions, config.toolchainOptions ?? {}, args);

        toolchain.serve(toolchainOptions);

    } catch (error) {
        logError(error.message);
    }
}