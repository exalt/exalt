import esbuild from "rollup-plugin-esbuild";

export default {
    input: {
        index: "src/index.js",
        decorators: "src/decorators.js"
    },
    output: { dir: "dist", format: "esm", banner: "/* Copyright (c) 2021 Outwalk Studios */" },
    plugins: [
        esbuild({
            minify: true,
            target: "es2015",
        })
    ]
};