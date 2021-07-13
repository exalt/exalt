import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { log, logError} from "../utils/logging";
import { copyFolder } from "../utils/file-system";

export async function dev({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);
    rollupConfig.watch = { exclude: "node_modules/**" };

    const watcher = rollup.watch(rollupConfig);

    watcher.on("event", (event) => {
        switch (event.code) {
            case "BUNDLE_END":
                copyFolder("public", config.dest, true);
                log("compiled successfully");
                break;

            case "ERROR":
                logError(event.error.message);
                if(event.error.frame) console.log(event.error.frame);
                break;

            case "FATAL":
                logError("Fatal Error Occurred!");
                process.exit(1);
        }
    });
}