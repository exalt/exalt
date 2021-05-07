import { defaultOptions } from "./configs/default";
import { serve } from "./cmds/serve";
import { start } from "./cmds/start";
import { build } from "./cmds/build";
import { logError } from "./utils/logging";

/* export the toolchain */
export default ({ toolchainOptions, ...config }) => {

    const settings = { ...defaultOptions, ...toolchainOptions };

    return {
        serve: () => {
            if(settings.library) {
                logError("The serve command does not support library builds!");
                return;
            }

            serve({ config, settings });
        },
        start: () => {
            if(settings.library) {
                logError("The start command does not support library builds!");
                return;
            }

            start({ config, settings });
        },
        build: () => build({ config, settings })
    };
};