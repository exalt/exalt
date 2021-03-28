import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { color, logError } from "../utils/logging";
import { copyAssets } from "../utils/file-system";

export async function serve({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);
    rollupConfig.watch = { exclude: "node_modules/**" };

    const watcher = rollup.watch(rollupConfig);

    watcher.on("event", (event) => {
        switch (event.code) {
            case "BUNDLE_END":
                copyAssets("public", config.dest);
                console.log(`${color.cyan}info${color.reset} - compiled successfully`);
                break;

            case "ERROR":
                logError(`Exalt StackTrace: ${event.error.message}`);
                if (event.error.loc) {
                    logError(`File: ${event.error.id}`);
                    logError(`Line: ${event.error.loc.line}, Column: ${event.error.loc.column}`);
                    if (event.error.frame) console.log(event.error.frame);
                }
                break;

            case "FATAL":
                logError("Fatal Error Occurred!");
                process.exit(1);
        }
    });
}