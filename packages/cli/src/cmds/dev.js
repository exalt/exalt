import { loadConfig, loadToolchain, loadOptions } from "../utils/config";
import { logError } from "../utils/logging";

/* starts the application in development mode */
export default async function dev(args) {

    /* set the environment to development */
    process.env.NODE_ENV = "development";

    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const options = loadOptions(config, args);

        /* run the toolchain */
        toolchain(options).dev();

    } catch (error) {
        logError(error.message);
    }
}