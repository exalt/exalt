# Exalt Toolchain

The build toolchain

![Actions](https://github.com/exalt/exalt/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/exalt/exalt/blob/main/LICENSE)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

---

## Installation

You can install @exalt/toolchain using npm:

```
npm install --save-dev @exalt/toolchain
```

To make this toolchain the active toolchain for @exalt/cli, set it as the value for the
`toolchain` property in `exalt.json`

```json
{
    "toolchain": "@exalt/toolchain"
}
```

---

## What Does This Toolchain Do?

This toolchain enables the following features for @exalt/cli:
- JavaScript & Typescript bundling, transpilation, and minification.
- Import aliasing.
- Live reloading development server.
- Generation of HTML based on output files.
- Support for importing css files.
- Support for importing json files.
- Support for folder components.


This toolchain offers some options to configure this functionality.

#### Options:
- library (default: false) - sets the project to be compiled as a library.
- target (default: "es2015") - sets the JavaScript version to be transpiled to.
- minify (default: false) - determines whether or not the build should be minified.
- sourcemap (default: false) - determines whether or not sourcemaps should be generated.
- paths (default: {}) - object that maps aliases to file paths.
- open (default: true) - tells the cli whether or not to launch your app or not.
- port (default: 3000) - sets the web server port.
- headers (default: {}) - sets headers to be sent with each request/response.

---

## TypeScript Support

This toolchain uses esbuild behind the scenes, this means that typescript support is ready out of the box. All you need to do is change your files to have a `.ts` file extension and make sure your `input` field is updated in exalt.json. The toolchain will then automatically compile your code down to JavaScript.

---

## Reporting Issues

If you are having trouble getting something to work with exalt or run into any problems, you can create a new [issue](https://github.com/exalt/exalt/issues).

If this framework does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

Exalt is licensed under the terms of the [**MIT**](https://github.com/exalt/exalt/blob/main/LICENSE) license.