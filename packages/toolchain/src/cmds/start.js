import server from "@jolt/server";
import { productionOptions } from "../configs/default";
import { color, logError } from "../utils/logging";
import fs from "fs";

export function start({ options }) {
    if (options.library) {
        logError("The start command does not support libraries");
        return;
    }

    if (!fs.existsSync("dist/app")) {
        logError("Failed to find a production build!");
        return;
    }

    const serverOptions = { ...productionOptions, ...options };

    try {
        server({
            port: serverOptions.devServer.port,
            root: "dist/app",
            spa: true
        });
        console.log(`${color.cyan}info${color.reset} - server started at ${color.green}http://localhost:${serverOptions.devServer.port}/${color.reset}`);
    } catch (error) {
        logError(error.message);
    }
}