/* NOTICE: decorators are a stage 2 proposal these can only be used by transpiling */

/* define the component with the default CustomElementRegistry */
export function define(options) {
    return (component) => {
        let name;

        if(typeof options == "object") {
            component.options = options;
            name = options.tag;
        } else {
            name = options;
        }

        window.customElements.define(name, component);
    };
}