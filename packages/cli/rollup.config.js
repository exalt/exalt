import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { builtinModules } from "module";

export default {
    input: "src/index.js",
    output: { file: "dist/cli.js", format: "cjs" },
    plugins: [
        esbuild({
            minify: true,
            target: "es2015"
        }),
        json()
    ],
    external: builtinModules
};