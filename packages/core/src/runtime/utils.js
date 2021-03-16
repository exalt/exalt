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

/* render the component and apply styles */
export function render(template, styles, container) {
    template = template ?? { source: "", events: [] };

    if (styles.length > 0) {
        template.source += `<style>${styles}</style>`;
    }

    Reconciler.reconcile(template, container);
}