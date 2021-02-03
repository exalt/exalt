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

    For help with a specific command run "exalt [command] --help"
    `,

    create: `
    Usage: exalt create [project-name] <options>
    - Creates a new project.

    Options:
        -d, --dest ........ Set the destination for the project.
        -l, --library ........ Generate a library project.
        -f, --force ........ Override the project if it already exists.
        --skip-install ........ Skip installing project dependencies.
        --skip-git ........ Skip initializing a git repository for the project.
    `,
};

/* print out the requested help menu */
export default function help(args) {
    const subCommand = args._[0] == "help" ? args._[1] : args._[0];
    console.log(helpMap[subCommand] || helpMap.default);
}