import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { color, logError } from "../utils/logging";
import { copyFolder } from "../utils/file-system";

export async function build({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);

    try {
        console.log(`${color.cyan}info${color.reset} - creating an optimized production build...`);

        const bundle = await rollup.rollup(rollupConfig);
        await bundle.write(rollupConfig.output);

        if (!settings.library) {
            copyFolder("public", config.dest);
        }

        console.log(`${color.cyan}info${color.reset} - compiled successfully`);

    } catch (error) {
        logError(`Exalt StackTrace: ${error.message}`);
        if (error.loc) {
            logError(`File: ${error.id}`);
            logError(`Line: ${error.loc.line}, Column: ${error.loc.column}`);
            if (error.frame) console.log(error.frame);
        }
    }
}