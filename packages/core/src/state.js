/* State class to manage component and application state */
export class State {

    /* set a new state, (merges with the previous state) */
    set(state) {
        this.prototype = Object.assign(this, state);
    }

    /* create a reactive object */
    static createReactiveObject(object, callback) {
        return new Proxy(object, {
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
                    target[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* the property does not exist, so we create it */
                target[key] = value;
                return true;
            }
        });
    }

    /* create a new reactive state object */
    static createState(callback) {
        return State.createReactiveObject(new State(), callback);
    }

    /* creates a new reactive array object */
    static createArrayProxy(array, callback) {
        return new Proxy(array, {
            set: (target, key, value) => {
                /* prevent redundant state updates */
                if (key == "prototype" || target[key] == value) return true;

                /* if the property does not exist, and the value is an array, make it reactive */
                if (Array.isArray(value)) {
                    target[key] = State.createArrayProxy(value, callback);
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