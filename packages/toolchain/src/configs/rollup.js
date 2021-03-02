import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import folder from "rollup-plugin-import-folder";
import css from "rollup-plugin-import-css";
import template from "rollup-plugin-html-literals";
import esbuild from "rollup-plugin-esbuild";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { color } from "../utils/logging";
import path from "path";
import fs from "fs";

export default function getRollupConfig({ config, options }) {

    /* override config options when building a library */
    if (options.library) {
        config.dest = "dist";
        config.format = "esm";
    }

    /* parse the alias paths into the expected format */
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

    /* render the html template */
    const renderHTML = ({ files, publicPath, title }) => {
        try {
            let html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

            const scripts = [];
            const links = [];

            for (let file of files.js) {
                scripts.push(`<script src="${publicPath + file.fileName}"></script>`);
            }

            for (let file of files.css) {
                links.push(`<link rel="stylesheet" href="${publicPath + file.fileName}" />`);
            }

            const mapping = {
                "title": title,
                "links": links.join("\n"),
                "scripts": scripts.join("\n")
            };

            const keys = Object.keys(mapping);

            for (let key of keys) {
                html = html.replace(new RegExp(`{{${key}}}`, "g"), mapping[key]);
            }

            return html;
        } catch {
            throw new Error(`Failed to find an index.html file in the "public" directory`);
        }

    };

    const plugins = [
        /* resolve modules from node_modules */
        resolve(),

        /* import commonjs modules as es modules */
        commonjs(),

        /* import json files as es modules */
        json(),

        /* map aliases to relative file paths */
        alias({ entries: getAliasPaths(options.paths) }),

        /* import folder components */
        folder(),

        /* import css */
        css({
            output: "index.css",
            minify: options.minify
        }),

        /* minify tagged template literals */
        template({
            options: {
                shouldMinify: () => options.minify,
                minifyOptions: {
                    keepClosingSlash: true
                }
            }
        }),

        /* transpile and minify the source code */
        esbuild({
            target: options.target,
            minify: options.minify,
            sourceMap: options.sourcemap,
            loaders: {
                ".json": "json"
            }
        })
    ];

    /* if the project is not a library add app specific plugins */
    if (!options.library) {

        /* generate the html files */
        plugins.push(
            html({
                title: config.name,
                publicPath: "/",
                template: renderHTML
            })
        );

        /* if we are in a development environment, run the development server */
        if (process.env.NODE_ENV == "development") {
            plugins.push(
                serve({
                    open: options.devServer.open,
                    port: options.devServer.port,
                    headers: options.devServer.headers,
                    contentBase: config.dest,
                    historyApiFallback: true,
                    verbose: false,
                    onListening: () => {
                        console.log(`${color.cyan}info${color.reset} - server started at ${color.green}http://localhost:${options.devServer.port}/${color.reset}`);
                    }
                }),
                livereload({
                    watch: config.dest,
                    verbose: false
                })
            );
        }
    }

    /* construct the rollup config */
    const rollupConfig = {
        input: config.input,
        plugins: plugins
    };

    rollupConfig.output = (typeof config.input != "string")
        ? { dir: config.dest, format: "esm" }
        : { file: `${config.dest}/index.js`, format: config.format, name: "bundle" };

    rollupConfig.output.sourcemap = options.sourcemap;

    return rollupConfig;
}