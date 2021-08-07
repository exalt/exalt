/* REGEX rule to enable the use of self closing tags */
const SELF_CLOSING_TAGS = /<([a-z|-]+)([^>]*)\/>/g;

/* parse a template literal into a template object */
export function createTemplate(strings, values) {
    const data = [];

    const source = strings.reduce((combined, string, index) => {
        const value = values[index] ?? "";
        let match;

        /* if we find an attribute binding, collect the data and place a marker */
        if ((match = string.match(/ ([a-z]*)=$/i))) {
            data.push({ name: match[1], value: value });
            return combined + string + `"{{a}}"`;
        }

        /* if we find a template, merge it into this template */
        else if (isTemplate(value)) {
            data.push(...value.data);
            return combined + string + value.source;
        }

        /* if we find an array of templates, merge them into this template */
        else if (isTemplateArray(value)) {
            let source = "";

            for (let part of value) {
                data.push(...part.data);
                source += part.source;
            }

            return combined + string + source;
        }

        /* if we find an array, iterate through it and add them as strings to this template */
        else if (Array.isArray(value)) {
            let source = "";

            for (let part of value) {
                source += part;
            }

            return combined + string + source;
        }

        /* if the value is a boolean, dont render it (this is for conditional rendering) */
        else if (typeof value == "boolean") {
            return combined + string;
        }

        /* else add the string with its value to this template */
        else {
            return combined + string + value;
        }
    }, "").replace(SELF_CLOSING_TAGS, "<$1$2></$1>");

    return { source, data };
}

/* compile the template into a DOM tree */
export function compileTemplate({ source, data }) {
    const template = document.createElement("template");
    template.innerHTML = source;

    /* if there is no data to process, return the template */
    if(data.length == 0) return template.content;

    const walker = document.createTreeWalker(template.content, 1);

    let currentNode;
    let index = 0;

    /* walk through the DOM tree, and process attributes */
    while ((currentNode = walker.nextNode())) {
        if (currentNode.hasAttributes()) {
            const attributes = currentNode.attributes;
            const length = attributes.length - 1;

            /* walk through the attributes in reverse because we collected them in reverse */
            for (let i = length; i >= 0; --i) {
                const attribute = attributes[i];

                /* if its an attribute binding, process further */
                if (attribute.value == "{{a}}") {
                    const { name, value } = data[index++];

                    /* bind the attribute as a prop */
                    currentNode.props = currentNode.props ?? {};
                    currentNode.props[name] = value;
                    currentNode.removeAttribute(name);

                    /* process the binding further depending on data type */
                    if(name.startsWith("on") && typeof value == "function") {
                        currentNode.addEventListener(name.slice(2), eventWrapper);
                    } else if (typeof value == "string") {
                        currentNode.setAttribute(name, value);
                    } else if (typeof value == "boolean" && value != false) {
                        currentNode.setAttribute(name, "");
                    }
                }
            }
        }
    }

    /* return the processed DOM tree */
    return template.content;
}

/* check if an object is a template */
function isTemplate(value) {
    return (typeof value == "object" && value.source != undefined && value.data != undefined);
}

/* check if an object is an array of templates */
function isTemplateArray(value) {
    return (Array.isArray(value) && isTemplate(value[0]));
}

/* wrap the event to access its _listeners property */
function eventWrapper(event) {
    this.props[`on${event.type}`](event);
}