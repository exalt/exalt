<div align="center">
    <img src="https://raw.githubusercontent.com/OutwalkStudios/exalt/main/resources/exalt_logo.svg" alt="Exalt" width="400px" height="300px" />
</div>

<div align="center">
    <p><strong>A JavaScript framework for building universal apps.</strong></p>
    <p>Build responsive web apps for desktop and mobile platforms.</p>
    <a href="#">
        <img src="https://github.com/OutwalkStudios/exalt/workflows/build/badge.svg" alt="Current build status of Exalt">
    </a>
    <a href="https://github.com/OutwalkStudios/exalt/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Exalt is released under the MIT license">
    </a>
    <a href="https://www.patreon.com/outwalkstudios">
        <img src="https://img.shields.io/badge/patreon-donate-green.svg" alt="Donate on Patreon">
    </a>
    <a href="https://twitter.com/OutwalkStudios">
        <img src="https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg" alt="Follow us on Twitter">
    </a>
</div>

---

## Installation

To get started building applications in Exalt, the first step is to install the Exalt CLI.
The CLI is used to create projects and handle ongoing tasks such as building for production and running a development server.

To install the Exalt CLI, run the following command:

```
npm install -g @exalt/cli
```

You can read more on the Exalt CLI's [README](https://github.com/OutwalkStudios/exalt/tree/main/packages/cli#readme).

---

## Getting Started

### Create a new Project

You can create a new project by running the `create` command and supplying the project name.
If you want to create a component library, just pass the `--library` flag to the command.

```
exalt create <app-name>
```

The CLI will create a new project with the supplied name, install all the required dependencies, initialize a git repository, and configure the project.

### Run The Application

The Exalt CLI comes with a built in development server.
Running the `serve` command will launch a web server, watch your files, and build the app as you make changes.

```
# Navigate to the project folder
cd <app-name>

# Launch the development server
exalt serve
```

---

## Ecosystem

| Project | Description |
|---------|-------------|
| [@exalt/core](https://www.npmjs.com/package/@exalt/core)      | Core Framework |
| [@exalt/cli](https://www.npmjs.com/package/@exalt/cli)        | Framework CLI |
| [@exalt/toolchain](https://www.npmjs.com/package/@exalt/toolchain)      | Toolchain for JavaScript and TypeScript development |

---

## Resources
[Get Started Learning @exalt/core](https://github.com/OutwalkStudios/exalt/tree/main/packages/core#readme) - Learn the features provided by the core package. <br/>
[Get Started Learning @exalt/cli](https://github.com/OutwalkStudios/exalt/tree/main/packages/cli#readme) - Learn the features provided by the cli package. <br/>
[Get Started Learning @exalt/toolchain](https://github.com/OutwalkStudios/exalt/tree/main/packages/toolchain#readme) - Learn the features provided by the toolchain package. <br/>

---

## Reporting Issues

If you are having trouble getting something to work with exalt or run into any problems, you can create a new [issue](https://github.com/OutwalkStudios/exalt/issues).

If this framework does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

Exalt is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/exalt/blob/main/LICENSE) license.
