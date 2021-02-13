import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import folder from "rollup-plugin-import-folder";
import css from "rollup-plugin-import-css";
import template from "rollup-plugin-html-literals";
import esbuild from "rollup-plugin-esbuild";
import html from "@rollup/plugin-html";
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

    const renderHTML = ({ files, publicPath, title }) => {
        let html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

        const scripts = [];
        const links = [];

        for(let file of files.js) {
            scripts.push(`<script src="${publicPath + file.fileName}"></script>`);
        }

        for(let file of files.css) {
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
            define: options.define,
            loaders: {
                ".json": "json"
            }
        }),

        /* if the project is not a library, generate the html files */
        (() => {
            if (!options.library) {
                return html({
                    title: config.name,
                    publicPath: "./",
                    template: renderHTML
                });
            }
        })()
    ];

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