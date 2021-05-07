declare type UpdateCallback = (key?: string | number | symbol, value?: any) => void;

declare interface ComponentOptions {
    name: string,
    useShadow?: boolean;
    styles?: Array<string>,
    contexts?: Array<object>
}

declare interface Template {
    source: string;
    data: Array<any>
}

declare abstract class Component<P> extends HTMLElement {

    private _styles: string;
    private _refCount: number;

    props: P;
    root: ShadowRoot | HTMLElement;

    private connectedCallback(): void;
    private disconnectedCallback(): void;
    private _requestUpdate(): UpdateCallback;
    private _parseRefs(): void;

    reactive(value: any): any;
    createRef(): HTMLElement | null;

    abstract render(props?: P): Template | void;

    mount(): void;
    unmount(): void;
    onUpdate(key?: string | number | symbol, value?: any): void;
    shouldUpdate(key?: string | number | symbol, value?: any): boolean;

    static create(options: ComponentOptions, component: CustomElementConstructor): void;
}

declare function html(string: TemplateStringsArray, ...values: Array<any>): Template;

declare function createContext(context: object): object;

export { Template, Component, html, createContext };