import { compileTemplate } from "./template-engine";

/* diff an update the DOM */
export function reconcile(template, container, options = {}) {
    /* if the template is null, make it into an empty template */
    template = template ?? { source: "", data: [] };

    /* if styles are provided, inject them into the template */
    if (options.styles) {
        template.source += `<style>${options.styles}</style>`;
    }

    /* compile the template into a DOM node */
    const templateNode = compileTemplate(template);

    /* if the container is empty, just append the template */
    if (container.childElementCount == 0) {
        container.appendChild(templateNode);
        return;
    }

    /* diff the template with the container */
    diff(templateNode, container);
    diffChildren(templateNode, container);
}

/* walk the DOM tree to determine if the nodes need to be updated */
function walk(newNode, oldNode) {
    if (!oldNode) return newNode;
    else if (!newNode) return null;
    else if (newNode.tagName != oldNode.tagName) return newNode;
    else {
        diff(newNode, oldNode);

        if (!newNode.shadowRoot && newNode.childNodes.length > 0) {
            diffChildren(newNode, oldNode);
        }

        return oldNode;
    }
}

/* find an update the differences between two nodes */
function diff(newNode, oldNode) {
    /* check if the nodes are equal inlcuding checking props */

    let nodeType = newNode.nodeType;
    let nodeName = newNode.nodeName;

    if (nodeType == 1) {
        diffAttributes(newNode, oldNode);
        diffProps(newNode, oldNode);

    } else if (nodeType == 3 || nodeType == 8) {
        if (oldNode.nodeValue != newNode.nodeValue) {
            oldNode.nodeValue = newNode.nodeValue;
        }
    }

    if (nodeName == "INPUT") updateInput(newNode, oldNode);
    else if (nodeName == "OPTION") updateAttribute(newNode, oldNode);
    else if (nodeName == "TEXTAREA") updateTextarea(newNode, oldNode);
}

function diffAttributes(newNode, oldNode) {

}

function diffProps(newNode, oldNode) {

}

function diffChildren(newNode, oldNode) {

}

function updateAttribute(newNode, oldNode, name) {

}

function updateInput(newNode, oldNode, name) {

}

function updateTextarea(newNode, oldNode) {

}

function isSameNode(a, b) {

}

function isEqualNode(a, b) {
    
}