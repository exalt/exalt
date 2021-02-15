import serve from "app-serve";
import { productionOptions } from "../configs/default";
import { color, logError } from "../utils/logging";
import fs from "fs";

export function start({ config, options }) {
    if (options.library) {
        logError("The start command does not support libraries");
        return;
    }

    if (!fs.existsSync(config.dest)) {
        logError("Failed to find a production build!");
        return;
    }

    const serverOptions = { ...productionOptions, ...options };

    try {
        serve({
            port: serverOptions.devServer.port,
            headers: serverOptions.devServer.headers,
            contentBase: config.dest,
            historyApiFallback: true,
            verbose: false,
            onListening: () => {
                console.log(`${color.cyan}info${color.reset} - server started at ${color.green}http://localhost:${serverOptions.devServer.port}/${color.reset}`);
            }
        });
    } catch (error) {
        logError(error.message);
    }
}