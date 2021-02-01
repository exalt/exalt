import { spawn, exec } from "child_process";

/* Tasks Utilities to run subprocesses */
export class Tasks {

    /* run npm across multiple platforms from a node process */
    static npm(args, options = {}) {
        return spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", args, options);
    }

    /* run git to create a new repository */
    static git(options, callback) {
        return exec("git init", options, callback);
    }
}