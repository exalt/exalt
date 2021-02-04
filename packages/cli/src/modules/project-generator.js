import { FileSystem } from "../utils/file-system";
import { spawn, exec } from "child_process";
import path from "path";
import fs from "fs";

/* ProjectGenerate class for generating projects */
export class ProjectGenerator {

    constructor(name, options) {
        this.name = name;
        this.dest = path.join(process.cwd(), options.getOption("dest", "d", "."), this.name);
        this.library = options.getOption("library", "l", false);

        this.template = (this.library)
            ? path.join(__dirname, "../templates/library")
            : path.join(__dirname, "../templates/application");

        this.force = options.getOption("force", "f", false);
        this.skipInstall = options.getOption("skip-install", null, false);
        this.skipGit = options.getOption("skip-git", null, false);
    }

    /* generate the project */
    async generate() {
        /* check if the project already exists */
        if (fs.existsSync(this.dest)) {
            if (this.force) FileSystem.deleteDirectory(this.dest);
            else {
                console.error(`ERROR: ${this.name} already exists!`);
                return;
            }
        }

        console.log(`Creating ${this.name}...\n`);

        /* Start copying template files to the destination */
        try {
            FileSystem.createDirectory(this.dest);
            FileSystem.copyTemplate(this.template, this.dest, { "project-name": this.name });
        } catch (error) {
            console.error("ERROR: Failed to create the project template.");
            throw error;
        }

        /* if the skip-install flag is not present, install the project dependencies */
        if (!this.skipInstall) {
            console.log("Installing dependencies, this could take a while.\n");

            try {
                await this.installDependencies();
            } catch (error) {
                console.error("ERROR: Failed to install project dependencies!");
                FileSystem.deleteDirectory(this.dest);
                throw error;
            }
        }

        /* if the skip-git flag is not present, initialize a git repository */
        if (!this.skipGit) {
            console.log("Intitalizing Git Repository...\n");

            try {
                await this.intitializeGitRepository();
            } catch (error) {
                console.error("ERROR: Failed to initialize the git repository!");
                FileSystem.deleteDirectory(this.dest);
                throw error;
            }
        }

        this.printStartMessage();
    }

    /* install project dependencies */
    installDependencies() {
        return new Promise((resolve, reject) => {
            const npm = /^win/.test(process.platform) ? "npm.cmd" : "npm";

            const thread = spawn(npm, ["install"], {
                cwd: this.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    /* intitialize a git repository */
    intitializeGitRepository() {
        return new Promise((resolve, reject) => {
            const thread = exec("git init", { cwd: this.dest }, (error) => {
                if (error) reject(error);
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    /* print the startup message when a project is done being generated */
    printStartMessage() {
        console.log(`Successfully creates ${this.name}\n`);
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");
        console.log(` > cd ${this.unresolvedDest}/${this.name}`);

        if (this.skipInstall) {
            console.log(` > npm install`);
        }

        if (!this.library) {
            console.log(" > npm run build");
        } else {
            console.log(" > npm run dev");
        }

        console.log("----------------------------------");
    }
}