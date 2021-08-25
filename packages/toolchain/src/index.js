import { defaultOptions } from "./configs/default";
import { dev } from "./cmds/dev";
import { start } from "./cmds/start";
import { build } from "./cmds/build";
import { logError } from "./utils/logging";
import fs from "fs";
import path from "path";

/* export the toolchain */
export default ({ toolchainOptions, ...config }) => {
    const settings = { ...defaultOptions, ...toolchainOptions };
    settings.library = !(fs.existsSync(path.join(process.cwd(), "public", "index.html")));

    return {
        dev: () => {
            if (settings.library) {
                logError("The dev command does not support library builds!");
                return;
            }

            dev({ config, settings });
        },
        start: () => {
            if (settings.library) {
                logError("The start command does not support library builds!");
                return;
            }

            start({ config, settings });
        },
        build: () => build({ config, settings })
    };
};