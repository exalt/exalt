import { Reactive } from "./reactive";
import {
    getComponentAttributes,
    getAttributeObserver,
    getComponentOptions,
    render
} from "./runtime/utils";

/* Component class for building reusable pieces of a UI */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* get the options specified in the component creation */
        const { useShadow, styles } = getComponentOptions(this.constructor);

        this._observer = getAttributeObserver(this, this._requestUpdate(true));
        this._styles = styles.join("");
        this._refCount = 0;

        /* create the component root */
        this.root = (useShadow) ? this.attachShadow({ mode: "open" }) : this;
    }

    /* native lifecycle callback, gets called whenever a component is added to the dom */
    connectedCallback() {
        
        /* get the component attributes */
        this.attribs = getComponentAttributes(this);
        if(this.state) {
            this.state = Reactive.createReactiveObject(this.state ?? {}, this._requestUpdate());
        }

        /* render the component */
        render(this.render(this.attribs), this._styles, this.root);

        /* collect all the refs */
        if(this._refCount > 0) {
            this.root.querySelectorAll("[ref]").forEach((node) => {
                this[node.getAttribute("ref")] = node;
                node.removeAttribute("ref");
            });
        }

        this.mount();
    }

    /* nataive lifecycle callback, gets called whenever a component is removed from the dom */
    disconnectedCallback() {
        this.unmount();
        this._observer.disconnect();
    }

    /* request an update function callback */
    _requestUpdate(updateAttribs = false) {
        return (key, value) => {
            if (this.shouldUpdate(key, value)) {
                if (updateAttribs) this.attribs[key] = value;
                render(this.render(this.attribs), this._styles, this.root);
                this.onUpdate(key, value);
            }
        };
    }

    /* create a reference to a node in the template */
    createRef() {
        this._refCount++;
        return null;
    }

    /* subscribe to a state context */
    useContext(context) {
        context._components.push(this._requestUpdate());
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
        component._options = options;

        if (!options.name) {
            console.error("Exalt: ComponentOptions.name is required.");
            return;
        }

        window.customElements.define(options.name, component);
    }
}