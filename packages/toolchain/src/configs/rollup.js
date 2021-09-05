import esbuild from "rollup-plugin-esbuild";
import template from "rollup-plugin-html-literals";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import folder from "rollup-plugin-import-folder";
import css from "rollup-plugin-import-css";
import del from "rollup-plugin-delete";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import watch from "rollup-plugin-watch";
import copy from "rollup-plugin-copy";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { color, log } from "../utils/logging";
import path from "path";
import fs from "fs";


export function createRollupConfig(config, settings) {
    const production = (process.env.NODE_ENV == "production");

    if (settings.legacy && typeof config.input != "string") {
        throw new Error("Code splitting is not supported in legacy builds!");
    }

    if (settings.legacy && settings.external != undefined) {
        throw new Error(`The "external" toolchain option is not supported in legacy builds!`);
    }

    if(settings.legacy && settings.library) {
        throw new Error("Libraries are not supported in legacy builds!");
    }

    /* format the paths config to be compatible with @rollup/plugin-alias */
    const formatAliasPaths = (paths) => {
        if (!paths) return undefined;

        return Object.keys(paths).map((key) => {
            return { find: key, replacement: path.resolve(process.cwd(), paths[key]) };
        });
    };

    /* generate an html template using the template hook in @rollup/plugin-html */
    const generateHTML = ({ attributes, files, publicPath, title }) => {
        let html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

        const scripts = [];
        const links = [];

        if (settings.legacy) {
            const source = "https://unpkg.com/@webcomponents/webcomponentsjs@2.6.0/webcomponents-loader.js";
            scripts.push(`\t<script src="${source}"></script>`);
        }

        if (files.js) {
            for (let file of files.js) {
                const attribs = makeHtmlAttributes(attributes.script);
                scripts.push(`\t<script${attribs} src="${publicPath + file.fileName}"></script>`);
                if (!settings.legacy) break;
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

    const generateOutputOptions = () => {
        if (settings.legacy) {
            return {
                file: `${settings.dest}/index.js`,
                format: "iife",
                name: "bundle"
            };
        }

        return { dir: settings.dest, format: "esm" };
    };

    return {
        input: config.input,
        output: generateOutputOptions(),
        external: settings.external,
        plugins: [
            esbuild({
                target: settings.target,
                minify: production,
                loaders: { ".js": "ts" }
            }),

            template({
                shouldMinify: () => production,
                minifyOptions: {
                    caseSensitive: true,
                    keepClosingSlash: true,
                    removeAttributeQuotes: true,
                    collapseBooleanAttributes: true
                }
            }),

            resolve({ browser: true }),

            commonjs(),

            json(),

            alias({ entries: formatAliasPaths(settings.paths) }),

            folder(),

            css({ minify: production }),

            del({
                targets: `${settings.dest}/*`,
                runOnce: !production
            }),

            !settings.library && html({
                title: config.name,
                publicPath: settings.publicPath,
                template: generateHTML
            }),

            !settings.library && watch({ dir: "public" }),

            !settings.library && copy({
                targets: [{ src: "public/*", dest: settings.dest }],
                copyOnce: !production
            }),

            !production && serve({
                open: settings.open,
                port: settings.port,
                contentBase: settings.dest,
                historyApiFallback: true,
                verbose: false,
                onListening: () => log(`server started at ${color.green}http://localhost:${settings.port}/${color.reset}`)
            }),

            !production && livereload({ watch: settings.dest, verbose: false })
        ]
    };
}