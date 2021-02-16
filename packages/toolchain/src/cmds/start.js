import serve from "app-serve";
import { defaultOptions } from "../configs/default";
import { color, logError } from "../utils/logging";
import fs from "fs";

export function start({ config, options }) {
    const buildOptions = { ...defaultOptions, ...options };

    if (buildOptions.library) {
        logError("The start command does not support libraries");
        return;
    }

    if (!fs.existsSync(config.dest)) {
        logError("Failed to find a production build!");
        return;
    }

    try {
        serve({
            port: buildOptions.devServer.port,
            headers: buildOptions.devServer.headers,
            contentBase: config.dest,
            historyApiFallback: true,
            verbose: false,
            onListening: () => {
                console.log(`${color.cyan}info${color.reset} - server started at ${color.green}http://localhost:${buildOptions.devServer.port}/${color.reset}`);
            }
        });
    } catch (error) {
        logError(error.message);
    }
}