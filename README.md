# ![Exalt Logo](https://raw.githubusercontent.com/exalt/exalt/main/resources/exalt_banner.jpg)

![build](https://github.com/exalt/exalt/workflows/build/badge.svg)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/exalt/exalt/blob/main/LICENSE)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)
[![twitter](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/exaltjs)

Exalt is a JavaScript framework for developing websites, apps and component libraries.
Exalt prioritizes bundle size and cross framework compatibilty by making use of Web Components. This means you can use Exalt components with your favorite libraries and frameworks.

According to [webcomponents.dev](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/#bundle-size-30) Exalt ranks first place on bundle size when minified!

---

## Documentation

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Ecosystem](#ecosystem)
* [Core Documentation](https://www.exaltjs.com/docs/#exalt-core)
* [CLI Documentation](https://www.exaltjs.com/docs/#exalt-cli)
* [Toolchain Documentation](https://www.exaltjs.com/docs/#exalt-toolchain)
* [Supporting Development](#supporting-development)

---

## Installation

Exalt is super easy to get up and running. First install the [Exalt CLI](https://github.com/exalt/exalt/tree/main/packages/cli#readme) globaly. This will give you access to the exalt commands that help you create and develop your project.

To install the Exalt CLI, run the following command:

```
npm install -g @exalt/cli
```

When the Exalt CLI is used outside a project, it can only generate projects but when used inside a project folder, it can load the specified toolchain and power the development commands. This allows the cli to be used regardless of build requirements. If the default toolchain does not fit your needs you can [create your own](https://github.com/exalt/exalt/tree/main/packages/cli#building-your-own-toolchain).

If you are using VSCode, you can get a better development experience by using the [Exalt VSCode Extension](https://marketplace.visualstudio.com/items?itemName=jleeson.vscode-exalt).
This extension provides support for syntax highlighting, auto completion, and intellisense for exalt templates.

---

## Getting Started

### Create a new Project

You can create a new project by running the `create` command and supplying the project name. This will generate your new project, install the required dependencies, and initialize a new git repository. By default `@exalt/toolchain` is used to power your projects build pipeline. This can be changed using the `toolchain` option in your exalt.json file.

```
exalt create <app-name>
```

### Run The Application

While using the default toolchain, the `dev` command will launch a web server, watch your files, and build the app as you make changes. As soon as the initial build is complete it will open your app in your default web browser. Any builds after this will refresh the page.

```
# Navigate to the project folder
cd <app-name>

# Launch the development server
exalt dev
```

---

## Ecosystem

| Project | Description |
|---------|-------------|
| [@exalt/core](https://www.npmjs.com/package/@exalt/core)      | Core Framework |
| [@exalt/cli](https://www.npmjs.com/package/@exalt/cli)        | Framework CLI |
| [@exalt/toolchain](https://www.npmjs.com/package/@exalt/toolchain)      | Toolchain for JavaScript and TypeScript development |
| [@exalt/router](https://www.npmjs.com/package/@exalt/router)        | A simple client side router for exalt apps |
| [@exalt/ssr](https://www.npmjs.com/package/@exalt/ssr)        | A module to render web components on the server |

---

## Supporting Development

Exalt is licensed under [MIT](https://github.com/exalt/exalt/blob/main/LICENSE) and is developed during the authors free time.

If you are interested in supporting the project financially, You can sponsor the project on [Patreon](https://patreon.com/outwalkstudios) or [PayPal](http://paypal.me/outwalkstudios)

---

## Reporting Issues

If you are having trouble getting something to work with exalt or run into any problems, you can create a new [issue](https://github.com/exalt/exalt/issues).

If this framework does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

Exalt is licensed under the terms of the [**MIT**](https://github.com/exalt/exalt/blob/main/LICENSE) license.
