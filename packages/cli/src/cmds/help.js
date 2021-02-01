/* the list of commands with corresponding help menus */
const helpMap = {
    default: `
    Usage: exalt [command] <options>
    Options:
        -v, --version ........ Logs the cli version.
        -h, --help ........ Logs the help menu.
    Commands:
        create [project-name] <options> ........ Creates a new project.
        serve <options> ........ Runs the project on a development server.
        build <options> ........ Builds the project for production.
        start <options> ........ Runs the production build.
    `
};

/* print out the requested help menu */
export default function help(args) {
    const subCommand = args._[0] == "help" ? args._[1] : args._[0];
    console.log(helpMap[subCommand] || helpMap.default);
}