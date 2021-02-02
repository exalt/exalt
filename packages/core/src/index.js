import { TemplateEngine } from "./runtime/template-engine";
import { Reactive } from "./reactive";

/* create a template object using a template literal */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}

/* create a state context */
export function createContext(context) {
    context._components = [];

    return Reactive.createReactiveObject(context, (key, value) => {
        for (let callback of context._components) {
            callback(key, value);
        }
    });
}

export { Component } from "./component";