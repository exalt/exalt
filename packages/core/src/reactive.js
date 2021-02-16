/* Reactive class to manage reactive data */
export class Reactive {

    /* merge inital object with the reactive object */
    constructor(obj) {
        this.set(obj);
    }

    /* set a new state, (merges with the previous state) */
    set(state) {
        this.prototype = Object.assign(this, state);
    }

    /* create a reactive object */
    static createReactiveObject(obj, callback) {
        return new Proxy(new Reactive(obj), {
            set: (target, key, value) => {
                /* prevent redundant state updates */
                if (key == "prototype" || target[key] == value) return true;

                /* if the property exists, it should be updated */
                if (target[key] != undefined) {
                    target[key] = value;
                    callback(key, value);
                    return true;
                }

                /* if the property does not exist, and the value is an array, make it reactive */
                if (Array.isArray(value)) {
                    target[key] = Reactive.createArrayProxy(value, callback);
                    return true;
                }

                /* the property does not exist, so we create it */
                target[key] = value;
                return true;
            }
        });
    }

    /* creates a new reactive array object */
    static createArrayProxy(array, callback) {
        return new Proxy(array, {
            set: (target, key, value) => {
                /* prevent redundant state updates */
                if (key == "prototype" || target[key] == value) return true;

                /* if the property does not exist, and the value is an array, make it reactive */
                if (Array.isArray(value)) {
                    target[key] = Reactive.createArrayProxy(value, callback);
                    return true;
                }

                /* the property does not exist, so we create it */
                target[key] = value;
                callback(key, value);
                return true;
            }
        });
    }
}