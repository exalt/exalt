import {
    getComponentAttributes,
    getAttributeObserver,
    getComponentOptions,
    render
} from "./runtime/runtime";
import { State } from "./state";

/* Component class for building reusable pieces of a UI */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* get the component attributes */
        this.attribs = getComponentAttributes(this);
        this._observer = getAttributeObserver(this, this._requestUpdate(true));
        this.state = State.createState(this._requestUpdate());

        /* get the options specified in the component creation */
        const { useShadow, styles } = getComponentOptions(this.constructor);

        this.root = (useShadow) ? this.attachShadow({ mode: "open" }) : this;
        this.styles = styles.join("");
    }

    /* request an update function callback */
    _requestUpdate(updateAttribs = false) {
        return (key, value) => {
            if (this.shouldUpdate(key, value)) {
                if (updateAttribs) this.attribs[key] = value;
                render(this.render(this.attribs), this.styles, this.root);
                this.onUpdate(key, value);
            }
        };
    }

    /* native lifecycle callback, gets called whenever a component is added to the dom */
    connectedCallback() {
        render(this.render(), this.styles, this.root);
        this.mount();
    }

    /* nataive lifecycle callback, gets called whenever a component is removed from the dom */
    disconnectedCallback() {
        this.unmount();
        this._observer.disconnect();
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