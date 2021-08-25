import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { log, logError } from "../utils/logging";
import { copyFolder } from "../utils/file-system";

export async function build({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);

    try {
        log("creating an optimized production build...");

        const bundle = await rollup.rollup(rollupConfig);
        await bundle.write(rollupConfig.output);

        if (!settings.library) copyFolder("public", settings.dest);

        log("compiled successfully");

    } catch (error) {
        logError(error.message);
        if(error.frame) console.log(error.frame);
    }
}