import { ProjectGenerator } from "../modules/project-generator";

export default function create(args) {
    const name = args._[1];

    if (!name) {
        console.error("Missing a project name! (Example: exalt create my-app)");
        return;
    }

    new ProjectGenerator(name, args).generate();
}