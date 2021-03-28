import { loadConfig, loadToolchain, loadOptions } from "../utils/config";
import { logError } from "../utils/logging";

/* starts the application in production mode */
export default async function start(args) {

    /* set the environment to production */
    process.env.NODE_ENV = "production";

    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const options = loadOptions(config, args);

        /* run the toolchain */
        toolchain(options).start();

    } catch (error) {
        logError(error.message);
    }
}