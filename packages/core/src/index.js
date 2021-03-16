import { createTemplate } from "./runtime/template-engine";
import { createReactiveObject } from "./reactive";

/* create a template object using a tagged template literal */
export function html(strings, ...values) {
    return createTemplate(strings, values);
}

/* create a state context */
export function createContext(context) {
    context._components = [];

    return createReactiveObject(context, (key, value) => {
        for (let callback of context._components) {
            callback(key, value);
        }
    });
}

export { Component } from "./component";