import { loadConfig, loadToolchain, loadOptions } from "../utils/config";
import { logError } from "../utils/logging";

/* build the project for production */
export default async function build(args) {

    /* set the environment to production */
    process.env.NODE_ENV = "production";

    try {
        const config = loadConfig();
        const toolchain = await loadToolchain(config);
        const options = loadOptions({ ...config, ...args });

        /* run the toolchain */
        toolchain.build(options);

    } catch (error) {
        logError(error.message);
    }
}