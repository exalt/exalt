# Exalt CLI

The CLI tool for development

![Actions](https://github.com/OutwalkStudios/exalt/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OutwalkStudios/exalt/blob/main/LICENSE)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

---

## Installation

You can install @exalt/cli using npm:

```
npm install -g @exalt/cli
```

---

## Usage

The Exalt CLI comes with several commands to run the development process.

### Create a New Project.

You can create a new project using the `create` command.
If you want to create a component library, simply add the `--library` option.

```
exalt create [project-name] <options>
```

### Running a Development Server

You can run a development server by using the `serve` command.
This will run your project in development mode and watch your files for changes.
When a file is changed your app is automatically rebuilt and your page will refresh.

### Building a Project for Production

You can build the project for production using the `build` command.
This will build the project and place the files into the `dist` directory.

### Running your Production App

After building your app for production, you can run it using the `start` command.
This will run your app on a simple http server capable of serving a single page app or static files.

---

## Building your own toolchain

We try to make sure that the default toolchain meets the needs of most projects.
In cases where it fails to meet your project requirements, we offer an easy solution to build your own toolchain.

A toolchain is a file that default exports a function that returns an object of command functions.
This function recieves an object with two properties as its only agrument. These properties are `config` and `options`

The commands that are availble for toolchains to control are `serve`, `start`, and `build`.

### Config Property

The config property is controlled by the platform your targeting, the cli, and your config file.
The config property includes these properties.

- name: string - the project name.
- input: string | object - the entry files to compile.
- format: string - the output format. (defined by the platform)
- dest: string - the output destination. (defined by the platform)

### Options Property

The options property is controlled by the `toolchainOptions` property in your config file.
Any options inside toolchainOptions are designed to modify the behavior of the active toolchain.

**Example:**
```js
export default ({ config, options }) => {

    return {
        serve: () => {},
        start: () => {},
        build: () => {}
    };
};
```

NOTE: If you make use of ESM module syntax such as `export` and `import`, you must first compile it to commonjs format.

---

## Reporting Issues

If you are having trouble getting something to work with exalt or run into any problems, you can create a new [issue](https://github.com/OutwalkStudios/exalt/issues).

If this framework does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

Exalt is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/exalt/blob/main/LICENSE) license.