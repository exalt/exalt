import esbuild from "rollup-plugin-esbuild";

export default {
    input: "src/index.js",
    output: [
        { file: "dist/core.esm.js", format: "esm", banner: "/* Copyright (c) 2021 Outwalk Studios */" },
        { file: "dist/core.cjs.js", format: "cjs", banner: "/* Copyright (c) 2021 Outwalk Studios */" }
    ],
    plugins: [
        esbuild({
            minify: false,
            target: "es2015",
        })
    ]
};