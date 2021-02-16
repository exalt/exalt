import rollup from "rollup";
import getRollupConfig from "../configs/rollup";
import { defaultOptions } from "../configs/default";
import { color, logError, logWarning } from "../utils/logging";
import { copyAssets } from "../utils/file-system";

export async function serve({ config, options }) {
    if(options.library) {
        logError("the serve command does not support libraries");
        return;
    }
    
    const buildOptions = { ...defaultOptions, ...options };
    const rollupConfig = getRollupConfig({ config, options: buildOptions });
    rollupConfig.watch = { exclude: ["node_modules/**"] };

    rollupConfig.onwarn = (warning) => {
        logWarning(`Exalt Warning: ${warning.message}`);
        if (warning.loc) {
            logWarning(`File: ${warning.id}`);
            logWarning(`Line: ${warning.loc.line}, Column: ${warning.loc.column}`);
            if (warning.frame) { console.log(warning.frame); }
        }
    };

    const watcher = rollup.watch(rollupConfig);

    watcher.on("event", (event) => {
        switch (event.code) {
            case "BUNDLE_END":
                copyAssets("public", config.dest);
                console.log(`${color.cyan}info${color.reset} - compiled successfully`);
                break;
            case "ERROR":
                logWarning(`\nExalt StackTrace: ${event.error.message}`);
                if (event.error.loc) {
                    logWarning(`File: ${event.error.id}`);
                    logWarning(`Line: ${event.error.loc.line}, Column: ${event.error.loc.column}`);
                    if (event.error.frame) { console.log(event.error.frame); }
                }
                break;
            case "FATAL":
                logError("Fatal Error Occurred!");
                process.exit(1);
        }
    });
}