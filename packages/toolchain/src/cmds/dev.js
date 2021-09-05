import rollup from "rollup";
import { createRollupConfig } from "../configs/rollup";
import { log, logError} from "../utils/logging";

export async function dev({ config, settings }) {
    const rollupConfig = createRollupConfig(config, settings);
    rollupConfig.watch = { exclude: "node_modules/**" };

    const watcher = rollup.watch(rollupConfig);

    watcher.on("event", (event) => {
        switch (event.code) {
            case "BUNDLE_END":
                log("compiled successfully");
                event.result.close();
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