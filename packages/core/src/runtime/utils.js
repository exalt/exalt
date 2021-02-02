import { Reconciler } from "./reconciler";

/* calculates the options and the defaults for the component */
export function getComponentOptions(component) {
    const styles = component._options.styles;
    const useShadow = component._options.useShadow;

    return {
        styles: styles ?? [],
        useShadow: useShadow ?? true
    };
}

/* resolve an attribute value to its non string value */
export function resolveAttributeValue(value) {
    switch (value) {
        case "": return true;
        case "undefined": return undefined;
        case "null": return null;
        case "true": return true;
        case "false": return false;
        default: return value;
    }
}

/* gets the component attributes and calculates boolean attributes */
export function getComponentAttributes(component) {
    const attributes = {};

    for (let attribute of component.attributes) {
        attributes[attribute.localName] = resolveAttributeValue(attribute.value);
    }

    return attributes;
}

/* create a MutationObserver to watch for attribute changes */
export function getAttributeObserver(element, callback) {
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type == "attributes") {
                const name = mutation.attributeName;
                callback(name, resolveAttributeValue(mutation.target.getAttribute(name)));
            }
        }
    });

    observer.observe(element, { attributes: true });
    return observer;
}

/* render the component and apply styles */
export function render(template, styles, container) {
    template = template ?? { source: "", events: [] };

    if (styles.length > 0) {
        template.source += `<style>${styles}</style>`;
    }

    Reconciler.reconcile(template, container);
}