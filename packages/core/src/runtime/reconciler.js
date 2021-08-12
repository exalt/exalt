import { compileTemplate, isEventAttribute } from "./template-engine";

/* diff an update the DOM */
export function reconcile(template, container, styles) {
    /* if the template is null, make it into an empty template */
    template = template ?? { source: "", data: [] };

    /* if styles are provided, inject them into the template */
    for(let style of styles) {
        template.source += `<style>${style}</style>`;
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

        /* if the node has children and not a shadow root, diff them */
        if (!newNode.shadowRoot && newNode.childNodes.length > 0) {
            diffChildren(newNode, oldNode);
        }

        return oldNode;
    }
}

/* find an update the differences between two nodes */
function diff(newNode, oldNode) {
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
    else if (nodeName == "OPTION") updateAttribute(newNode, oldNode, "selected");
    else if (nodeName == "TEXTAREA") updateTextarea(newNode, oldNode);
}

/* find and update the differences between two nodes attributes */
function diffAttributes(newNode, oldNode) {
    const newAttributes = newNode.attributes;
    const oldAttributes = oldNode.attributes;

    let length = newAttributes.length - 1;

    for (let i = length; i >= 0; --i) {
        const { localName, value, namespaceURI } = newAttributes[i];

        if (namespaceURI) {
            if (oldNode.getAttributeNS(namespaceURI, localName) == value) {
                oldNode.setAttributeNS(namespaceURI, localName, value);
            }
        } else {
            if (!oldNode.hasAttribute(localName)) oldNode.setAttribute(localName, value);
            else {
                if (oldNode.getAttribute(localName) != value) {
                    if (value == "null" || value == "undefined") oldNode.removeAttribute(localName);
                    else oldNode.setAttribute(localName, value);
                }
            }
        }
    }

    length = oldAttributes.length - 1;

    for (let i = length; i >= 0; --i) {
        const attribute = oldAttributes[i];

        if (attribute.specified) {
            const { localName, namespaceURI } = attribute;

            if (namespaceURI) {
                if (!newNode.hasAttributeNS(namespaceURI, localName)) {
                    oldNode.removeAttributeNS(namespaceURI, localName);
                }
            } else {
                if (!newNode.hasAttribute(localName)) {
                    oldNode.removeAttribute(localName);
                }
            }
        }
    }
}

/* find and update the differences between two nodes props */
function diffProps(newNode, oldNode) {
    const newProps = newNode.props;
    const oldProps = oldNode.props;

    if (newProps && oldProps) {
        const newKeys = Object.keys(newProps);
        for (let name of newKeys) {
            const newProp = newProps[name];

            if(isEventAttribute(name, newProp)) {
                if(!oldNode.props[name]) oldNode.addEventListener(name.slice(2), newProp);
                oldNode.props[name] = newProp;
            } else if (oldProps[name] != newProp) {
                oldNode.props[name] = newProp;
            }
        }
    }
}

/* find and update the differences between two nodes children */
function diffChildren(newNode, oldNode) {
    let offset = 0;

    for (let i = 0; ; i++) {
        const oldChild = oldNode.childNodes[i];
        const newChild = newNode.childNodes[i - offset];

        /* if both nodes are empty, do nothing */
        if (!oldChild && !newChild) break;

        /* if there is no new child, remove the old child */
        else if (!newChild) {
            oldNode.removeChild(oldChild);
            i--;
        }

        /* if there is no old child, add the new child */
        else if (!oldChild) {
            oldNode.appendChild(newChild);
            offset++;
        }

        /* if both nodes are the same, see if they need to be updated */
        else if (isSameNode(newChild, oldChild)) {
            const morphed = walk(newChild, oldChild);

            if (morphed != oldChild) {
                oldNode.replaceChild(morphed, oldChild);
                offset++;
            }
        }

        /* if both nodes do not share an ID or placeholder, try to reorder them */
        else {
            let oldMatch = null;

            const length = oldNode.childNodes.length;

            for (let j = i; j < length; j++) {
                if (isSameNode(oldNode.childNodes[j], newChild)) {
                    oldMatch = oldNode.childNodes[i];
                    break;
                }
            }

            if (oldMatch) {
                const morphed = walk(newChild, oldChild);

                if (morphed != oldMatch) {
                    oldNode.replaceChild(morphed, oldChild);
                    offset++;
                }
            }

            else if (!newChild.id && !oldChild.id) {
                const morphed = walk(newChild, oldChild);

                if (morphed != oldChild) {
                    oldNode.replaceChild(morphed, oldChild);
                    offset++;
                }
            }

            else {
                oldNode.insertBefore(newChild, oldChild);
                offset++;
            }
        }
    }
}

/* update an attribute */
function updateAttribute(newNode, oldNode, name) {
    if (newNode[name] != oldNode[name]) {
        oldNode[name] = newNode[name];

        if (newNode[name]) oldNode.setAttribute(name, "");
        else oldNode.removeAttribute(name);
    }
}

/* update an input element */
function updateInput(newNode, oldNode) {
    const newValue = newNode.value;
    const oldValue = oldNode.value;

    updateAttribute(newNode, oldNode, "checked");
    updateAttribute(newNode, oldNode, "disabled");

    if (newNode.indeterminate != oldNode.indeterminate) {
        oldNode.indeterminate = newNode.indeterminate;
    }

    if (oldNode.type == "file") return;

    if (newValue != oldValue) {
        oldNode.setAttribute("value", newValue);
        oldNode.value = newValue;
    }

    if (!newNode.hasAttribute("value")) oldNode.removeAttribute("value");
    else if (oldNode.type == "range") oldNode.value == newValue;
}

/* update a text area element */
function updateTextarea(newNode, oldNode) {
    const newValue = newNode.value;

    if (newValue != oldNode.value) {
        oldNode.value = newValue;
    }

    if (oldNode.firstChild && oldNode.firstChild.nodeValue != newValue) {
        oldNode.firstChild.nodeValue = newValue;
    }
}

/* determine if two nodes are the same */
function isSameNode(a, b) {
    if (a.id) return (a.id == b.id);
    if (a.tagName != b.tagName) return false;
    if (a.nodeType == 3) return (a.nodeValue == b.nodeValue);
    return false;
}