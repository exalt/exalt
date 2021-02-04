import { parseArguments } from "./utils/parser";
import version from "./cmds/version";
import help from "./cmds/help";
import create from "./cmds/create";

/* parse the cli arguments */
const args = parseArguments(process.argv.slice(2));
let cmd = args._[0] || "help";

/* determine what command to run */
if (args.version || args.v) cmd = "version";
else if (args.help || args.h) cmd = "help";

const commands = {
    "version": version,
    "help": help,
    "create": create
};

if (commands[cmd]) commands[cmd](args);
else console.error(`Unknown Command: ${cmd}`);