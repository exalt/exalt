import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import folder from "rollup-plugin-import-folder";
import css from "rollup-plugin-import-css";
import template from "rollup-plugin-html-literals";
import esbuild from "rollup-plugin-esbuild";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import watch from "rollup-plugin-watch";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { color, log, logWarning } from "../utils/logging";
import path from "path";
import fs from "fs";

export function createRollupConfig(config, settings) {

    config.format = "iife";
    config.dest = (process.env.NODE_ENV == "production") ? "dist" : ".exalt";

    /* override the config options */
    if (settings.library || settings.codesplitting || typeof config.input != "string") {
        config.format = "esm";
    }

    /* map the paths config option to a format that rollup can understand */
    const parseAliasPaths = (paths) => {
        if (!paths) return null;

        return Object.keys(paths).map((key) => {
            return { find: key, replacement: path.resolve(process.cwd(), paths[key]) };
        });
    };

    /* render the custom html output */
    const renderHTML = ({ attributes, files, publicPath, title }) => {
        let html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

        const scripts = [];
        const links = [];

        if (files.js) {
            for (let file of files.js) {
                const attribs = makeHtmlAttributes(attributes.script);
                scripts.push(`\t<script${attribs} src="${publicPath + file.fileName}"></script>`);
                if (settings.codesplitting) break;
            }
        }

        if (files.css) {
            for (let file of files.css) {
                const attribs = makeHtmlAttributes(attributes.link);
                links.push(`\t<link${attribs} rel="stylesheet" href="${publicPath + file.fileName}" />`);
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
    };

    const plugins = [
        babel({
            babelHelpers: "bundled",
            plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }]
            ]
        }),
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
                    caseSensitive: true,
                    keepClosingSlash: true,
                    removeAttributeQuotes: true,
                    collapseBooleanAttributes: true
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

        /* generate the html file and watch the public directory */
        plugins.push(
            html({
                title: config.name,
                publicPath: settings.publicPath,
                template: renderHTML
            }),
            watch({ dir: "public" })
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
                        log(`server started at ${color.green}http://localhost:${settings.port}/${color.reset}`);
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
        plugins: plugins,
        external: (settings.library) ? settings.external : null
    };

    if (!settings.library && settings.external != undefined) {
        logWarning(`the "external" toolchain option is only supported in library builds!`);
    }

    if (typeof config.input != "string" || settings.codesplitting) {
        rollupConfig.output = {
            dir: config.dest,
            format: "esm",
            sourcemap: settings.sourcemap
        };
    } else {
        rollupConfig.output = {
            file: `${config.dest}/index.js`,
            format: config.format,
            name: "bundle",
            sourcemap: settings.sourcemap
        };
    }

    return rollupConfig;
}