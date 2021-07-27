/* NOTICE: decorators are a stage 2 proposal these can only be used by transpiling */

/* define the component with the default CustomElementRegistry */
export function define(name) {
    return function(component) {
        window.customElements.define(name, component);
    };
}

/* configure the component options */
export function options(options) {
    return function(component) {
        component.options = options;
    };
}