import build from "./cmds/build";

const defaultOptions = {
    library: false,
    target: "es2015",
    minify: false,
    sourcemap: false,
    define: {},
    paths: {},
    devServer: {}
};

export { defaultOptions, build };