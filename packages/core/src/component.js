import { createReactiveObject, createReactiveProperty, processReactiveProperties } from "./runtime/reactive";
import { reconcile } from "./runtime/reconciler";

/* Component class for building reusable pieces of a UI */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* get the options specified in the component creation */
        const { useShadow, styles, stores } = this.constructor._options;

        this._styles = styles.join("");
        this._refCount = 0;
        this._reactiveCount = 0;

        /* create the component root */
        this.root = (useShadow) ? this.attachShadow({ mode: "open" }) : this;

        /* subscribe to all the stores */
        for (let store of stores) {
            store._components.push(this._requestUpdate());
        }
    }

    /* native lifecycle callback, gets called whenever a component is added to the dom */
    connectedCallback() {

        /* make the props passed in through the template engine reactive */
        this.props = createReactiveObject(this.props, this._requestUpdate());

        /* if a state property is declared make it reactive (this is for backwards compatibility) */
        if (this.state) {
            this.state = createReactiveObject(this.state, this._requestUpdate());
        }

        /* process any reactive properties that were defined */
        if (this._reactiveCount > 0) {
            processReactiveProperties(this, this._requestUpdate());
        }

        /* render the component */
        reconcile(this.render(this.props), this.root, { styles: this._styles });

        /* collect all the refs */
        this._parseRefs();

        this.mount();
    }

    /* native lifecycle callback, gets called whenever a component is removed from the dom */
    disconnectedCallback() {
        this.unmount();
    }

    /* request an update function callback */
    _requestUpdate() {
        return (key, value) => {
            if (this.shouldUpdate(key, value)) {
                reconcile(this.render(this.props), this.root, { styles: this._styles });
                this._parseRefs();
                this.onUpdate(key, value);
            }
        };
    }

    /* collect all the refs */
    _parseRefs() {
        if (this._refCount > 0) {
            this.root.querySelectorAll("[ref]").forEach((node) => {
                this[node.getAttribute("ref")] = node;
            });
        }
    }

    /* create a reactive property */
    reactive(value) {
        this._reactiveCount++;
        return createReactiveProperty(value);
    }

    /* create a reference to a node in the template */
    createRef() {
        this._refCount++;
        return null;
    }

    /* renders the component dom tree by returning a template */
    render() { }

    /* lifecycle method called when a component is successfully mounted */
    mount() { }

    /* lifecycle method called when a component is successfully unmounted */
    unmount() { }

    /* lifecycle method called when a component is updated */
    onUpdate() { }

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