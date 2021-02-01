/* Parser to read CLI arguments */
export class Parser {

    /* extract arguments from the command line and map them into an object */
    static parseArguments(args) {
        const tmp = {};
        tmp._ = [];

        let arg = null;
        let newArg = [];

        for (let i = 0; i < args.length; i++) {
            arg = args[i];
            newArg = [];

            if (arg.startsWith("-") && !arg.startsWith("--")) {
                arg = arg.replace(/-/g, "--");
            }

            if (arg.startsWith("--")) {
                newArg.push(arg.slice(2));
                const tmpArg = args[i + 1];

                if (tmpArg != null && !tmpArg.startsWith("--")) {
                    newArg.push(tmpArg);
                    args.slice(args.indexOf(tmpArg), 1);
                } else {
                    newArg.push(true);
                }

                tmp[newArg[0]] = newArg[1];
            } else {
                tmp._.push(arg);
            }
        }

        return tmp;
    }
}