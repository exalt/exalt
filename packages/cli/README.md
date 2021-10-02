# Exalt CLI

Exalt CLI provides a clean interface to start new exalt projects and run your build pipeline.
Full documentation is available [here](https://www.exaltjs.com/docs/#exalt-cli)

![Actions](https://github.com/exalt/exalt/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/exalt/exalt/blob/main/LICENSE)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/exaltjs)

---

## Installation

You can install @exalt/cli using npm:

```
npm install -g @exalt/cli
```

---

## Usage

The Exalt CLI comes with several commands to run the development process.
These command descriptions assume you are using the default toolchain.

### Create a New Project.

You can create a new project by running the `create` command and supplying the project name. This will generate your new project, install the required dependencies, and initialize a new git repository. By default `@exalt/toolchain` is used to power your projects build pipeline. This can be changed using the `toolchain` option in your exalt.json file.

If you wish to generate a component library simply add the `--library` flag to the command.

```
exalt create [app-name] <options>
```

### Running a Development Server

The `dev` command will launch a web server, watch your files, and build the app as you make changes. As soon as the initial build is complete it will open your app in your default web browser. Any builds after this will refresh the page.

```
exalt dev <options>
```

### Building a Project for Production

You can build the project for production using the `build` command.
This will build the project and place the files into the `dist` directory.

```
exalt build <options>
```

### Running your Production App

After building your app for production, you can run it using the `start` command.
This will run your app on a simple http server capable of serving a single page app or static files.

```
exalt start <options>
```

---

## Building your own toolchain

We try to make sure that the default toolchain meets the needs of most projects.
In cases where it fails to meet your project requirements, we offer an easy solution to build your own toolchain.

A toolchain is a file that exports a default function and returns an object of command functions.
This function recieves the config object consiting of `name`, `input` and `toolchainOptions`

The commands that are availble for toolchains to control are `dev`, `start`, and `build`.

### Config Object

The config object is controlled by your config file.
The config object includes these properties.

- name: string - the project name.
- input: string | object | array - the entry files to compile.
- toolchainOptions: object - the options to customize the toolchain.


**Example:**
```js
export default ({ name, input, toolchainOptions }) => {

    return {
        dev: () => {},
        start: () => {},
        build: () => {}
    };
};
```

NOTE: If you make use of ESM module syntax such as `export` and `import`, you must first compile it to commonjs format.

---

## Reporting Issues

If you are having trouble getting something to work with exalt or run into any problems, you can create a new [issue](https://github.com/exalt/exalt/issues).

If this framework does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

Exalt is licensed under the terms of the [**MIT**](https://github.com/exalt/exalt/blob/main/LICENSE) license.