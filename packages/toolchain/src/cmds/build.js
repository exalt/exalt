import rollup from "rollup";
import getRollupConfig from "../configs/rollup";
import { productionOptions } from "../configs/default";
import { color, logError } from "../utils/logging";

export async function build({ config, options }) {
    const buildOptions = { ...productionOptions, ...options };
    const rollupConfig = getRollupConfig({ config, options: buildOptions });

    try {
        console.log(`${color.cyan}info${color.reset} - Creating an optimized production build...`);
        const bundle = await rollup.rollup(rollupConfig);
        await bundle.write(rollupConfig.output);
        console.log(`${color.cyan}info${color.reset} - Compiled successfully`);
    } catch (error) {
        logError(`\nExalt StackTrace: ${error.message}`);
        if (error.loc) {
            logError(`File: ${error.id}`);
            logError(`Line: ${error.loc.line}, Column: ${error.loc.column}`);
            if (error.frame) { console.log(error.frame); }
        }
    }
}