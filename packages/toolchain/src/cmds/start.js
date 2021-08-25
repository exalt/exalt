import serve from "app-serve";
import { color, log, logError } from "../utils/logging";
import fs from "fs";

export function start({ settings }) {
    if (!fs.existsSync(settings.dest)) {
        logError("Failed to find a production build!");
        return;
    }

    try {
        serve({
            port: settings.port,
            contentBase: settings.dest,
            historyApiFallback: true,
            verbose: false,
            onListening: () => {
                log(`server started at ${color.green}http://localhost:${settings.port}/${color.reset}`);
            }
        });
    } catch (error) {
        logError(error.message);
    }
}