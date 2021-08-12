/* NOTICE: decorators are a stage 2 proposal these can only be used by transpiling */

/* define the component with the default CustomElementRegistry */
export function define(options) {
    return (component) => {
        if(typeof options == "object") component.options = options;
        window.customElements.define(options.tag, component);
    };
}