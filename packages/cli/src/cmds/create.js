import { ProjectGenerator } from "../modules/project-generator";
import { logError } from "../utils/logging";

/* create a new project */
export default function create(args) {
    const name = args._[1];

    if (!name) {
        logError("Missing a project name! (Example: exalt create my-app)");
        return;
    }

    new ProjectGenerator(name, args).generate();
}