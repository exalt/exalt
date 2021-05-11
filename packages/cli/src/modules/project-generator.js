import { createDirectory, deleteDirectory, copyTemplate } from "../utils/file-system";
import { logError } from "../utils/logging";
import { spawnSync, exec } from "child_process";
import path from "path";
import fs from "fs";

/* ProjectGenerate class for generating projects */
export class ProjectGenerator {

    constructor(name, options) {
        this.name = name;
        this.dest = path.join(process.cwd(), options.getOption("dest", "d", "."), this.name);
        this.library = options.getOption("library", "l", false);

        this.force = options.getOption("force", "f", false);
        this.skipInstall = options.getOption("skip-install", null, false);
        this.skipGit = options.getOption("skip-git", null, false);

        this.template = (this.library)
            ? path.join(__dirname, "../templates/library")
            : path.join(__dirname, "../templates/application");

        this.dependencies = [
            { name: "@exalt/toolchain@0.3.x", dev: true },
            { name: "@exalt/cli@0.3.x", dev: true },
            { name: "@exalt/core@0.3.x", dev: this.library }
        ];
    }

    /* generate the project */
    async generate() {
        /* check if the project already exists */
        if (fs.existsSync(this.dest)) {
            if (this.force) deleteDirectory(this.dest);
            else {
                logError(`${this.name} already exists!`);
                return;
            }
        }

        console.log(`Creating ${this.name}...\n`);

        /* Start copying template files to the destination */
        try {
            createDirectory(this.dest);
            copyTemplate(this.template, this.dest, { "project-name": this.name });
        } catch (error) {
            logError(error.message);
            return;
        }

        /* initialize the project depending on what the cli flags allow */
        try {
            if (!this.skipInstall) await this.installDependencies();
            if (!this.skipGit) await this.intitializeGitRepository();
        } catch (error) {
            logError(error.message);
            deleteDirectory(this.dest);
            return;
        }

        this.printStartMessage();
    }

    /* install project dependencies */
    installDependencies() {
        return new Promise((resolve, reject) => {
            console.log("Installing dependencies, this could take a while.\n");

            const command = /^win/.test(process.platform) ? "npm.cmd" : "npm";
            const dependencies = this.dependencies.filter(({ dev }) => (!dev)).map(({ name }) => name);
            const devDependencies = this.dependencies.filter(({ dev }) => (dev)).map(({ name }) => name);

            /* spawn the child process and handle errors */
            const spawnProcess = (command, args) => {
                const { status, error } = spawnSync(command, args, { cwd: this.dest, stdio: "inherit" });
                if (status != 0) throw new Error("Failed to install project dependencies!");
                if (error) throw error;
            };

            try {
                spawnProcess(command, ["install", "--save"].concat(dependencies));
                spawnProcess(command, ["install", "--save-dev"].concat(devDependencies));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /* intitialize a git repository */
    intitializeGitRepository() {
        return new Promise((resolve, reject) => {
            console.log("\nIntitalizing Git Repository...\n");

            try {
                exec("git init", { cwd: this.dest });
                resolve();
            } catch {
                reject(new Error("Failed to initialize the git repository!"));
            }

        });
    }

    /* print the startup message when a project is done being generated */
    printStartMessage() {
        console.log(`\nSuccessfully created ${this.name}\n`);
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");
        console.log(` > cd ./${path.relative(process.cwd(), this.dest)}`);

        if (this.skipInstall) {
            console.log(` > npm install`);
        }

        if (this.library) {
            console.log(" > npm run build");
        } else {
            console.log(" > npm run dev");
        }

        console.log("----------------------------------");
    }
}