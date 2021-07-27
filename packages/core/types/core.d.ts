declare module "@exalt/core" {
    type UpdateCallback = (key?: string | number | symbol, value?: any) => void;

    interface ComponentProps {
        children: string;
        [key: string]: any;
    }

    interface Template {
        source: string;
        data: any[];
    }

    abstract class Component extends HTMLElement {

        private _styles: string[];
        private _reactive: number[];
        private _refs: boolean;

        props: ComponentProps;
        root: HTMLElement | ShadowRoot;

        private connectedCallback(): void;
        private disconnectedCallback(): void;
        private _requestUpdate(): UpdateCallback;
        private _parseRefs(): void;

        reactive(value: any): any;
        createRef(): HTMLElement | null;

        abstract render(props?: ComponentProps): Template | void;

        mount(): void;
        unmount(): void;
        onUpdate(key?: string | number | symbol, value?: any): void;
        shouldUpdate(key?: string | number | symbol, value?: any): boolean;
    }

    function html(string: TemplateStringsArray, ...values: any[]): Template;

    function createStore(store: object): object;

    export { Template, Component, html, createStore };
}

declare module "@exalt/core/decorators" {
    interface ComponentOptions {
        shadow?: boolean;
        styles?: string[];
        connect?: object[];
    }

    function define(name: string): void;
    function options(options: ComponentOptions): void;

    export { ComponentOptions, define, options };
}