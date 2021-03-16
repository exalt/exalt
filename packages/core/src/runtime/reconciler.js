import { compileTemplate } from "./template-engine";

/* Reconciler class for diffing and updating the dom */
export class Reconciler {

    /* diff and update the dom */
    static reconcile(template, container) {
        const templateNode = compileTemplate(template);

        if (container.childElementCount == 0) {
            container.appendChild(templateNode);
            return;
        }

        Reconciler.diff(templateNode, container);
        Reconciler.diffChildren(templateNode, container);
    }

    /* walk the dom tree to determine if the nodes need to be updated */
    static walk(newNode, oldNode) {
        if (!oldNode) return newNode;
        else if (!newNode) return null;
        else if (newNode.tagName != oldNode.tagName) return newNode;
        else {
            Reconciler.diff(newNode, oldNode);

            /* if the node has children and not a shadow root, diff them */
            if (!newNode.shadowRoot && newNode.childNodes.length > 0) {
                Reconciler.diffChildren(newNode, oldNode);
            }

            return oldNode;
        }
    }

    /* find and update the differences between two nodes */
    static diff(newNode, oldNode) {
        //if (newNode.isEqualNode(oldNode)) return;

        let nodeType = newNode.nodeType;
        let nodeName = newNode.nodeName;

        /* diff based on node types */
        if (nodeType == 1) {
            Reconciler.diffAttributes(newNode, oldNode);
            Reconciler.diffProps(newNode, oldNode);
        }
        else if (nodeType == 3 || nodeType == 8) {
            if (oldNode.nodeValue != newNode.nodeValue) {
                oldNode.nodeValue = newNode.nodeValue;
            }
        }

        /* diff based on node names */
        if (nodeName == "INPUT") Reconciler.updateInput(newNode, oldNode);
        else if (nodeName == "OPTION") Reconciler.updateAttribute(newNode, oldNode);
        else if (nodeName == "TEXTAREA") Reconciler.updateTextarea(newNode, oldNode);
    }

    static diffProps(newNode, oldNode) {
        if (newNode.props && oldNode.props) {
            for (let name of Object.keys(newNode.props)) {
                if(oldNode.props[name] != newNode.props[name]) {
                    oldNode.props[name] = newNode.props[name];
                }
            }
        }
    }

    /* find and update the differences between two nodes attributes */
    static diffAttributes(newNode, oldNode) {
        const newAttributes = newNode.attributes;
        const oldAttributes = oldNode.attributes;

        let length = newAttributes.length - 1;
        for (let i = length; i >= 0; --i) {
            const attribute = newAttributes[i];
            const name = attribute.localName;
            const value = attribute.value;
            const namespace = attribute.namespaceURI;

            if (namespace) {
                if (oldNode.getAttributeNS(namespace, name) == value) {
                    oldNode.setAttributeNS(namespace, name, value);
                }
            }

            else {
                if (!oldNode.hasAttribute(name)) oldNode.setAttribute(name, value);
                else {
                    if (oldNode.getAttribute(name) != value) {
                        if (value == "null" || value == "undefined") oldNode.removeAttribute(name);
                        else oldNode.setAttribute(name, value);
                    }
                }
            }
        }

        length = oldAttributes.length - 1;
        for (let i = length; i >= 0; --i) {
            const attribute = oldAttributes[i];

            if (attribute.specified) {
                const name = attribute.localName;
                const namespace = attribute.namespaceURI;

                if (namespace) {
                    if (!newNode.hasAttributeNS(namespace, name)) {
                        oldNode.removeAttributeNS(namespace, name);
                    }
                }

                else {
                    if (!newNode.hasAttribute(name)) {
                        oldNode.removeAttribute(name);
                    }
                }
            }
        }
    }

    /* find and update the differences between two nodes children */
    static diffChildren(newNode, oldNode) {
        if (Reconciler.isEqualNode(newNode, oldNode)) return;

        let offset = 0;

        for (let i = 0; ; i++) {
            const oldChild = oldNode.childNodes[i];
            const newChild = newNode.childNodes[i - offset];

            /* if both nodes are empty, do nothing */
            if (!oldChild && !newChild) {
                break;
            }

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
            else if (Reconciler.isSameNode(newChild, oldChild)) {
                const morphed = Reconciler.walk(newChild, oldChild);

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
                    if (Reconciler.isSameNode(oldNode.childNodes[j], newChild)) {
                        oldMatch = oldNode.childNodes[i];
                        break;
                    }
                }

                if (oldMatch) {
                    const morphed = Reconciler.walk(newChild, oldChild);

                    if (morphed != oldMatch) {
                        oldNode.replaceChild(morphed, oldChild);
                        offset++;
                    }
                }

                else if (!newChild.id && !oldChild.id) {
                    const morphed = Reconciler.walk(newChild, oldChild);

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
    static updateAttribute(newNode, oldNode, name) {
        if (newNode[name] !== oldNode[name]) {
            oldNode[name] = newNode[name];

            if (newNode[name]) oldNode.setAttribute(name, "");
            else oldNode.removeAttribute(name);
        }
    }

    /* update an input element */
    static updateInput(newNode, oldNode) {
        const newValue = newNode.value;
        const oldValue = oldNode.value;

        Reconciler.updateAttribute(newNode, oldNode, "checked");
        Reconciler.updateAttribute(newNode, oldNode, "disabled");

        if (newNode.indeterminate !== oldNode.indeterminate) {
            oldNode.indeterminate = newNode.indeterminate;
        }

        if (oldNode.type == "file") return;

        if (newValue != oldValue) {
            oldNode.setAttribute("value", newValue);
            oldNode.value = newValue;
        }

        if (newValue == "null") {
            oldNode.value = "";
            oldNode.removeAttribute("value");
        }

        if (!newNode.hasAttribute("value")) oldNode.removeAttribute("value");
        else if (oldNode.type == "range") oldNode.value == newValue;
    }

    /* update a text area element */
    static updateTextarea(newNode, oldNode) {
        const newValue = newNode.value;

        if (newValue != oldNode.value) {
            oldNode.value = newValue;
        }

        if (oldNode.firstChild && oldNode.firstChild.nodeValue != newValue) {
            oldNode.firstChild.nodeValue = newValue;
        }
    }

    /* determine if two nodes are the same */
    static isSameNode(a, b) {
        if (a.id) return (a.id == b.id);
        if (a.tagName != b.tagName) return false;
        if (a.nodeType == 3) return (a.nodeValue == b.nodeValue);
        return false;
    }

    static isEqualNode(a, b) {
        if (a.isEqualNode(b) && (a.props && b.props) && (a.props == b.props)) {
            return true;
        } else if (a.isEqualNode(b) && (!a.props && !b.props)) {
            return true;
        } else {
            return a.isEqualNode(b);
        }
    }
}