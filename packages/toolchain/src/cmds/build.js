import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { prerender } from "../utils/prerender";
import { log, logError } from "../utils/logging";
import path from "path";

export async function build({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);

    try {
        log("creating an optimized production build...");

        const bundle = await rollup.rollup(rollupConfig);
        await bundle.write(rollupConfig.output);
        await bundle.close();

        // TODO - prerender the app here
        if(settings.prerender) prerender(path.join(process.cwd(), settings.dest));

        log("compiled successfully");

    } catch (error) {
        logError(error.message);
        if(error.frame) console.log(error.frame);
    }
}