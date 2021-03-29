declare type UpdateCallback = (key?: string | number | symbol, value?: any) => void;

declare class ReactiveObject {
    private prototype: any;

    set(state: object): void;
}

declare interface ComponentOptions {
    name: string,
    useShadow?: boolean;
    styles?: Array<string>,
    contexts?: Array<ReactiveObject>
}

declare interface Template {
    source: string;
    data: Array<any>
}

declare abstract class Component<P, S> extends HTMLElement {

    private _styles: string;

    props: P;
    state: S;
    root: ShadowRoot | HTMLElement;

    private connectedCallback(): void;
    private disconnectedCallback(): void;
    private _requestUpdate(updateAttribs?: boolean): UpdateCallback;
    private _parseRefs(): void;

    createRef(): HTMLElement | null;

    abstract render(props?: P): Template | void;

    mount(): void;
    unmount(): void;
    onUpdate(key?: string | number | symbol, value?: any): void;
    shouldUpdate(key?: string | number | symbol, value?: any): void;

    static create(options: ComponentOptions, component: CustomElementConstructor): void;
}

declare function html(string: TemplateStringsArray, ...values: Array<any>): Template;

declare function createContext(context: object): object;

export { ReactiveObject, Template, Component, html, createContext };