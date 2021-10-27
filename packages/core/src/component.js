import { createReactiveObject, createReactiveProperties } from "./runtime/reactive";
import { reconcile } from "./runtime/reconciler";

/* Component class for building reusable pieces of a UI */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* get the options specified in the component creation */
        const parent = this.constructor;
        const defaultOptions = Object.assign({ shadow: true, styles: [], connect: [] }, parent.defaultOptions || {});
        const { shadow, styles, connect } = Object.assign(defaultOptions, parent.options || {});

        this._styles = styles;
        this._reactive = [];
        this._refs = false;
        this._debounce = null;

        /* create the component root */
        if (this.shadowRoot) {
            this.root = this.shadowRoot;
        } else {
            this.root = (shadow) ? this.attachShadow({ mode: "open" }) : this;
        }

        /* subscribe to all the stores */
        connect.forEach((store) => store._components.push(this._requestUpdate()));
    }

    /* native lifecycle callback, gets called whenever a component is added to the dom */
    connectedCallback() {

        const hasSSRProps = this.querySelector("script[type=application/json]");

        if (hasSSRProps) {
            this.props = JSON.parse(hasSSRProps.textContent);
        } else {
            this.props = this.props ?? {};
            if (this.hasAttributes()) {
                /* make sure to not override the existing props */
                const keys = Object.keys(this.props);
                Array.from(this.attributes)
                    .filter(({ localName }) => !keys.includes(localName))
                    .forEach(({ localName, value }) => {
                        this.props[localName] = (value == "") ? true : value;
                    });
            }
        }

        /* if there are attributes, make them accessible via props */


        /* render the component */
        reconcile(this.render(this.props), this.root, this._styles);

        /* make the props object reactive */
        this.props = createReactiveObject(this.props, this._requestUpdate());

        /* process any reactive properties that were defined */
        createReactiveProperties(this, this._reactive, this._requestUpdate());

        /* collect all the refs */
        this._parseRefs();

        this.mount && this.mount();
    }

    /* native lifecycle callback, gets called whenever a component is removed from the dom */
    disconnectedCallback() {
        this.unmount && this.unmount();
    }

    /* request an update function callback */
    _requestUpdate() {
        return (key, value) => {
            /* debounce the update so that we dont run multiple repaints per frame */
            if (this._debounce) {
                cancelAnimationFrame(this._debounce);
            }

            this._debounce = requestAnimationFrame(() => {
                if (this.shouldUpdate(key, value)) {
                    reconcile(this.render(this.props), this.root, this._styles);
                    this._parseRefs();
                    this.onUpdate && this.onUpdate(key, value);
                }
            });
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
}