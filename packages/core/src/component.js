import { createReactiveObject, createReactiveProperties } from "./runtime/reactive";
import { reconcile } from "./runtime/reconciler";

/* Component class for building reusable pieces of a UI */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* get the options specified in the component creation */
        const { useShadow, styles, stores } = this.constructor._options;

        this._styles = styles.join("");
        this._reactive = [];
        this._refs = false;

        /* create the component root */
        this.root = (useShadow) ? this.attachShadow({ mode: "open" }) : this;

        /* subscribe to all the stores */
        stores.forEach((store) => store._components.push(this._requestUpdate()));
    }

    /* native lifecycle callback, gets called whenever a component is added to the dom */
    connectedCallback() {

        /* render the component */
        reconcile(this.render(this.props), this.root, { styles: this._styles });

        /* make the props passed in through the template engine reactive */
        this.props = createReactiveObject(this.props, this._requestUpdate());

        /* process any reactive properties that were defined */
        createReactiveProperties(this, this._requestUpdate());

        /* collect all the refs */
        this._parseRefs();

        this.mount && this.mount();
    }

    /* native lifecycle callback, gets called whenever a component is removed from the dom */
    disconnectedCallback() {
        this.unmount && this.unmount();
    }

    /* override the setAttribute method to hook into props */
    setAttribute(name, value) {
        super.setAttribute(name, value);
        this.props[name] = (value == "") ? true : value;
    }

    /* override the removeAttribute method to hook into props */
    removeAttribute(name) {
        super.removeAttribute(name);
        delete this.props[name];
    }

    /* request an update function callback */
    _requestUpdate() {
        return (key, value) => {
            if (this.shouldUpdate(key, value)) {
                reconcile(this.render(this.props), this.root, { styles: this._styles });
                this._parseRefs();
                this.onUpdate && this.onUpdate(key, value);
            }
        };
    }

    /* collect all the refs */
    _parseRefs() {
        if (this._refs) {
            this.root.querySelectorAll("[ref]").forEach((node) => {
                this[node.getAttribute("ref")] = node;
            });
        }
    }

    /* create a reactive property */
    reactive(value) {
        this._reactive.push(Object.getOwnPropertyNames(this).length);
        return value;
    }

    /* create a reference to a node in the template */
    createRef() {
        this._refs = true;
        return null;
    }

    /* renders the component dom tree by returning a template */
    render() { }

    /* lifecycle method called when a component is about to be updated to prevent undesired updates */
    shouldUpdate() { return true; }

    /* define the component with the default CustomElementRegistry */
    static create(options, component) {
        const defaults = { useShadow: true, styles: [], stores: [] };
        component._options = { ...defaults, ...options };

        if (!options.name) {
            console.error("Exalt: ComponentOptions.name is required.");
            return;
        }

        window.customElements.define(options.name, component);
    }
}