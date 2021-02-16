/* TemplateEngine class to create and parse templates */
export class TemplateEngine {

    /* create a template object */
    static createTemplate(strings, values) {
        const events = [];

        let source = strings.reduce((template, string, index) => {
            const value = values[index] ?? "";

            /* if the string is an event, add an event marker and collect the event function */
            if (string.match(/ on[a-z]*="?$/) && typeof value == "function") {
                events.push(value);
                return template + string + "{{e}}";
            }

            /* if the value is a template, merge it with this template */
            else if (TemplateEngine.isTemplate(value)) {
                events.concat(value.events);
                return template + string + value.source;
            }

            /* if the value is an array of templates, merge them into this template */
            else if (TemplateEngine.isTemplateArray(value)) {
                let source = "";

                for (let fragment of value) {
                    events.conact(fragment.events);
                    source += fragment.source;
                }

                return template + string + source;
            }

            /* else add the string with its value to this template */
            else {
                return template + string + value;
            }
        }, "").replace(/<([a-z]+-[a-z]+)([^/>]*)\/>/g, "<$1$2></$1>");

        return { source, events };
    }

    /* process the template object into a dom tree */
    static processTemplate({ source, events }) {
        const template = document.createElement("template");
        template.innerHTML = source;

        if (events.length > 0) {
            const walker = document.createTreeWalker(template.content, 1);

            let currentNode;
            let index = 0;

            /* walk through the dom tree and bind any event attributes */
            while ((currentNode = walker.nextNode())) {
                if (currentNode.hasAttributes()) {
                    const length = currentNode.attributes.length - 1;

                    for (let i = length; i >= 0; --i) {
                        const attribute = currentNode.attributes[i];

                        /* if the attribute has an event marker, bind the event and remove the attribute */
                        if (attribute.value == "{{e}}") {
                            currentNode.addEventListener(attribute.localName.slice(2), events[index++]);
                            currentNode.removeAttribute(attribute.localName);
                        }
                    }
                }
            }
        }

        return template.content;
    }

    /* check if an object is a template */
    static isTemplate(value) {
        return (
            typeof value == "object" &&
            value.source &&
            value.events
        );
    }

    /* check if an object is an array of templates */
    static isTemplateArray(value) {
        return (
            Array.isArray(value) &&
            TemplateEngine.isTemplate(value[0])
        );
    }
}