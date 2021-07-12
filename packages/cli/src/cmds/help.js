import { color } from "../utils/logging";

/* the list of commands with corresponding help menus */
const helpMap = {
    default: `
    Usage: ${color.cyan}exalt [command] <options>${color.reset}
    Options:
        ${color.cyan}-v, --version${color.reset} ........ Logs the cli version.
        ${color.cyan}-h, --help${color.reset} ........ Logs the help menu.
    Commands:
        ${color.cyan}create${color.reset} [project-name] <options> ........ Creates a new project.
        ${color.cyan}dev${color.reset} <options> ........ Starts the application in development mode.
        ${color.cyan}start${color.reset} <options> ........ Starts the application in production mode.
        ${color.cyan}build${color.reset} <options> ........ Builds the project for production.

    For help with a specific command run "exalt [command] --help"
    `,

    create: `
    Usage: ${color.cyan}exalt create [project-name] <options>${color.reset}
    - Creates a new project.

    Options:
        ${color.cyan}-d, --dest${color.reset} ........ Set the destination for the project.
        ${color.cyan}-l, --library${color.reset} ........ Generate a library project.
        ${color.cyan}-f, --force${color.reset} ........ Override the project if it already exists.
        ${color.cyan}--skip-install${color.reset} ........ Skip installing project dependencies.
        ${color.cyan}--skip-git${color.reset} ........ Skip initializing a git repository for the project.
    `,

    dev: `
    Usage: ${color.cyan}exalt dev <options>${color.reset}
    - Starts the application in development mode.
    `,

    start: `
    Usage: ${color.cyan}exalt start <options>${color.reset}
    - Starts the application in production mode.
    `,

    build: `
    Usage: ${color.cyan}exalt build <options>${color.reset}
    - Builds the project for production.
    `
};

/* print out the requested help menu */
export default function help(args) {
    const subCommand = args._[0] == "help" ? args._[1] : args._[0];
    console.log(helpMap[subCommand] || helpMap.default);
}