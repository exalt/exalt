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

export function createRollupConfig(config, settings) {

    /* override the config options when building a library */
    if (settings.library) {
        config.dest = "dist";
        config.format = "esm";
    }

    const plugins = [
        /* resolve modules from node_modules */
        resolve({ browser: true }),

        /* resolve commonjs modules as es modules */
        commonjs(),

        /* resolve json files as es modules */
        json(),

        /* map aliases to relative file paths */
        alias({ entries: parseAliasPaths(settings.paths) }),

        /* resolve folder components */
        folder(),

        /* resolve css files */
        css({ minify: settings.minify }),

        /* minify tagged template literals */
        template({
            options: {
                shouldMinify: () => settings.minify,
                minifyOptions: {
                    keepClosingSlash: true,
                    removeAttributeQuotes: true
                }
            }
        }),

        /* transpile and minify the source code */
        esbuild({
            target: settings.target,
            minify: settings.minify,
            sourceMap: settings.sourcemap
        })
    ];

    /* if the project is not a library, add app specific plugins */
    if (!settings.library) {

        /* generate the html files */
        plugins.push(
            html({
                title: config.name,
                publicPath: settings.publicPath,
                template: renderHTML
            })
        );

        /* if we are in a development environment, run the dev server */
        if (process.env.NODE_ENV == "development") {
            plugins.push(
                serve({
                    open: settings.open,
                    port: settings.port,
                    headers: settings.headers,
                    contentBase: config.dest,
                    historyApiFallback: true,
                    verbose: false,
                    onListening: () => {
                        console.log(`${color.cyan}info${color.reset} - server started at ${color.green}http://localhost:${settings.port}/${color.reset}`);
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

    rollupConfig.output.sourcemap = settings.sourcemap;

    if(settings.library) rollupConfig.external = ["@exalt/core"];

    return rollupConfig;
}

/* map the paths config option to a format that rollup can understand */
function parseAliasPaths(paths) {
    if (!paths) return null;

    const keys = Object.keys(paths);

    return keys.map((key) => {
        return { find: key, replacement: path.resolve(process.cwd(), paths[key]) };
    });
}

/* render the custom html output */
function renderHTML({ files, publicPath, title }) {
    let html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

    const scripts = [];
    const links = [];

    if (files.js) {
        for (let file of files.js) {
            scripts.push(`\t<script src="${publicPath + file.fileName}"></script>`);
        }
    }

    if (files.css) {
        for (let file of files.css) {
            links.push(`\t<link rel="stylesheet" href="${publicPath + file.fileName}" />`);
        }
    }

    const titleTag = /<title>.*<\/title>/i.exec(html);
    const headTag = /<\/head>/i.exec(html);
    const bodyTag = /<\/body>/i.exec(html);

    if (!titleTag && !headTag && !bodyTag) {
        throw new Error(`public/index.html is missing required tags! (head, body, title)`);
    }

    html = html.replace(titleTag[0], `<title>${title}</title>`);
    html = html.replace(headTag[0], `${links.join("\n")}\n` + headTag[0]);
    html = html.replace(bodyTag[0], `${scripts.join("\n")}\n` + bodyTag[0]);

    return html;
}