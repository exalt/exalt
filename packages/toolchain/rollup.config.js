import esbuild from "rollup-plugin-esbuild";
import { dependencies } from "./package.json";
import { builtinModules } from "module";

export default {
    input: "src/index.js",
    output: { file: "dist/toolchain.js", format: "cjs", banner: "/* Copyright (c) 2021 Outwalk Studios */", exports: "default" },
    plugins: [
        esbuild({
            minify: true,
            target: "es2015"
        })
    ],
    external: Object.keys(dependencies).concat(builtinModules)
};