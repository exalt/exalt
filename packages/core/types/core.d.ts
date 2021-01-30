declare type UpdateCallback = (key?: string | number | symbol, value?: any) => void;

declare class State {
    private prototype: any;

    set(state: object): void;
    static createReactiveObject(obj: object, callback): object;
    static createState(callback: UpdateCallback): State;
    static createArrayProxy(array: Array<any>, callback: UpdateCallback): Array<any>;
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

declare interface Attributes {
    [key: string]: string;
}

declare abstract class Component<A, S extends State> extends HTMLElement {

    private _observer: MutationObserver;
    private _styles: string;

    attribs: A;
    state: S;
    root: ShadowRoot | HTMLElement;

    private connectedCallback(): void;
    private disconnectedCallback(): void;
    private _requestUpdate(updateAttribs?: boolean): UpdateCallback;

    useContext(context: object): void;

    abstract render(attribs?: A): Template | void;

    mount(): void;
    unmount(): void;
    onUpdate(key?: string | number | symbol, value?: any): void;
    shouldUpdate(key?: string | number | symbol, value?: any): void;

    static create(options: ComponentOptions, component: CustomElementConstructor): void;
}

declare function html(string: TemplateStringsArray, ...values: Array<any>): Template;

declare function createContext(context: object): object;