import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import folder from "rollup-plugin-import-folder";
import css from "rollup-plugin-import-css";
import template from "rollup-plugin-html-literals";
import esbuild from "rollup-plugin-esbuild";
import path from "path";

export default function getRollupConfig(options) {

    /* 
        output path to place files in & format to compile for

        NOTICE: these are going to be changing to be dynamic based on the platform
        to compile for.
    */
    const dest = (options.library) ? "dist" : ".exalt/app";
    const format = (options.library) ? "esm" : "iife";

    const getAliasPaths = (paths) => {
        if (!paths) return null;

        const keys = Object.keys(paths);

        return keys.map((key) => {
            return {
                find: key,
                replacement: path.resolve(process.cwd(), paths[key])
            };
        });
    };

    const plugins = [
        /* resolve modules from node_modules */
        resolve(),

        /* import commonjs modules as es modules */
        commonjs(),

        /* map aliases to relative file paths */
        alias({ entries: getAliasPaths(options.paths) }),

        /* import folder components */
        folder(),

        /* import css */
        css({
            output: `${dest}/index.css`,
            minify: options.minify
        })
    ];

    if (options.minify) {
        plugins.push(
            /* minify tagged template literals */
            template({
                options: {
                    minifyOptions: {
                        keepClosingSlash: true
                    }
                }
            })
        );
    }

    plugins.push(
        /* transpile and minify the source code */
        esbuild({
            target: options.target,
            minify: options.minify,
            sourceMap: options.sourcemap,
            define: options.define,
            loaders: {
                ".json": "json"
            }
        })
    );
    
    /* construct the config */
    const config = {
        input: options.input,
        plugins: plugins
    };

    if(typeof options.input != "string") {
        config.output = { dir: dest, format: "esm" };
    } else {
        config.output = { file: `${dest}/index.js`, format: format, name: "bundle" };
    }

    config.output.sourcemap = options.sourcemap;

    return config;
}