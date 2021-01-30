import { TemplateEngine } from "./runtime/template-engine";

/* create a template object using a template literal */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}