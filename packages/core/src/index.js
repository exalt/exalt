import { createTemplate } from "./runtime/template-engine";
import { createReactiveObject } from "./runtime/reactive";

/* create a template object using a tagged template literal */
export function html(strings, ...values) {
    return createTemplate(strings, values);
}

/* create a reactive store */
export function createStore(store) {
    store._components = [];

    return createReactiveObject(store, (key, value) => {
        for (let callback of store._components) {
            callback(key, value);
        }
    });
}

export { Component } from "./component";