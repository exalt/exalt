import { createDirectory, deleteDirectory, copyTemplate } from "../utils/file-system";
import { logError } from "../utils/logging";
import { spawn, exec } from "child_process";
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

        this.devDependencies = [
            "@exalt/toolchain@0.2.x",
            "@exalt/cli@0.2.x"
        ];

        this.dependencies = [
            "@exalt/core@0.2.x"
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

        /* if the skip-install flag is not present, install the project dependencies */
        if (!this.skipInstall) {
            console.log("Installing dependencies, this could take a while.\n");

            try {
                await this.installDependencies();
                await this.installDevDependencies();
            } catch (error) {
                logError(error.message);
                deleteDirectory(this.dest);
                return;
            }
        }

        /* if the skip-git flag is not present, initialize a git repository */
        if (!this.skipGit) {
            console.log("Intitalizing Git Repository...\n");

            try {
                await this.intitializeGitRepository();
            } catch (error) {
                logError(error.message);
                deleteDirectory(this.dest);
            }
        }

        this.printStartMessage();
    }

    /* install project dependencies */
    installDependencies() {
        return new Promise((resolve, reject) => {
            const npm = /^win/.test(process.platform) ? "npm.cmd" : "npm";

            const thread = spawn(npm, ["install", "--save"].concat(this.dependencies), {
                cwd: this.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject(new Error("Failed to install project dependencies!"));
            });
        });
    }

    /* install project devDependencies */
    installDevDependencies() {
        return new Promise((resolve, reject) => {
            const npm = /^win/.test(process.platform) ? "npm.cmd" : "npm";

            const thread = spawn(npm, ["install", "--save-dev"].concat(this.devDependencies), {
                cwd: this.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject(new Error("Failed to install project dependencies!"));
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
                else reject(new Error("Failed to initialize the git repository!"));
            });
        });
    }

    /* print the startup message when a project is done being generated */
    printStartMessage() {
        console.log(`Successfully created ${this.name}\n`);
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