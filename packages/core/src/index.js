import { TemplateEngine } from "./runtime/template-engine";
import { State } from "./state";

/* create a template object using a template literal */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}

/* create a state context */
export function createContext(context) {
    context._collections = [];

    return State.createReactiveObject(context, (key, value) => {
        for (let callback of context._collections) {
            callback(key, value);
        }
    });
}

export { Component } from "./component";