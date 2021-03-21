declare type UpdateCallback = (key?: string | number | symbol, value?: any) => void;

declare class State {
    private prototype: any;

    set(state: object): void;
}

declare interface ComponentOptions {
    name: string,
    styles?: Array<string>,
    useShadow?: boolean;
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
    useContext(context: object): void;

    abstract render(props?: P): Template | void;

    mount(): void;
    unmount(): void;
    onUpdate(key?: string | number | symbol, value?: any): void;
    shouldUpdate(key?: string | number | symbol, value?: any): void;

    static create(options: ComponentOptions, component: CustomElementConstructor): void;
}

declare function html(string: TemplateStringsArray, ...values: Array<any>): Template;

declare function createContext(context: object): object;

export { State, Template, Component, html, createContext };