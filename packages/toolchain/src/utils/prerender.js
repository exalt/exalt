import { loadBundle, renderToString } from "@exalt/ssr";
import { minify } from "html-minifier";
import { log } from "./logging";
import path from "path";
import fs from "fs";

export function prerender(buildPath) {
    const bundlePath = path.join(buildPath, "index.js");
    const htmlPath = path.join(buildPath, "index.html");

    const { App } = loadBundle(bundlePath);
    const template = String(fs.readFileSync(htmlPath));
    const renderedPages = [];

    const getPageOutputPath = (url) => {
        if (url == "/") return htmlPath;

        const routeDest = path.join(buildPath, url);

        if(!fs.existsSync(routeDest)) {
            fs.mkdirSync(routeDest, { recursive: true });
        }

        return path.join(routeDest, "index.html");
    };

    const renderPage = (url) => {
        log(`rendering page ${url}`);
        renderedPages.push(url);
        window.location.pathname = url;

        const html = renderToString(new App(), (currentNode) => {
            if (currentNode.nodeName != "A") return;

            const [href] = currentNode.getAttribute("href").split("#");
            if (href.startsWith("/") && !renderedPages.includes(href)) {
                renderPage(href);
            }
        });

        const DECLARATIVE_SHADOW_ROOT_POLLYFILL = `
        <script>
            function supportsDeclarativeShadowDOM(){return HTMLTemplateElement.prototype.hasOwnProperty("shadowRoot")}
            supportsDeclarativeShadowDOM()||document.querySelectorAll("template[shadowroot]").forEach(t=>{const e=t.getAttribute("shadowroot");
            t.parentNode.attachShadow({mode:e}).appendChild(t.content),t.remove()});
        </script>
        `;

        const source = template.replace("<app-root></app-root>", html).replace("</body>", DECLARATIVE_SHADOW_ROOT_POLLYFILL + "</body>");

        fs.writeFileSync(getPageOutputPath(url), minify(source, {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            minifyCSS: true,
            minifyJS: true
        }));
    };

    renderPage("/");
}