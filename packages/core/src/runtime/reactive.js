/* create a reactive property */
export function createReactiveProperty(value) {
    return { _reactive: true, value: value };
}

/* process the reactive properties and make them reactive */
export function processReactiveProperties(obj, callback) {
    /* collect all the reactive properties */
    const keys = Object.getOwnPropertyNames(obj).filter((key) => (obj[key] && obj[key]._reactive));

    for (let key of keys) {
        let value = obj[key].value;

        /* if the value is an array, turn it into a reactive array */
        if (Array.isArray(value)) {
            value = createReactiveArray(value, callback);
            Object.defineProperty(obj, key, {
                get: () => value,
                set: (newValue) => { callback(key, value = createReactiveArray(newValue, callback)); }
            });
        }

        /* if the value is an object, turn it into a reactive object */
        else if (Object.getPrototypeOf(value) == Object.prototype) {
            value = createReactiveObject(value, callback);
            Object.defineProperty(obj, key, {
                get: () => value,
                set: (newValue) => { callback(key, value = Object.assign(value, newValue)); }
            });
        }

        /* if the value is a primitive, make it reactive */
        else {
            Object.defineProperty(obj, key, {
                get: () => value,
                set: (newValue) => { callback(key, value = newValue); }
            });
        }
    }
}

/* create a reactive object */
export function createReactiveObject(value, callback) {
    const proxy = new Proxy({}, mutate(callback));
    /* we merge the value with the proxy to ensure than nested values become reactive */
    return Object.assign(proxy, value);
}

/* create a reactive array */
export function createReactiveArray(value, callback) {
    const proxy = new Proxy([], mutate(callback, true));
    /* we merge the value with the proxy to ensure than nested values become reactive */
    proxy.push(...value);
    return proxy;
}

/* handle the mutation of an object or array wrapped in a proxy */
function mutate(callback, isArrayMode = false) {
    return {
        set: (target, key, value) => {
            /* prevent redundant state updates */
            if (key == "prototype" || target[key] == value) return true;

            /* if the property exists, it should be updated */
            if (target[key] != undefined) {
                callback(key, target[key] = value);
                return true;
            }

            /* if the property does not exist, and the value is an array, make it reactive */
            if (Array.isArray(value)) {
                target[key] = createReactiveArray(value, callback);
                return true;
            }

            /* if the property does not exist, and the value is an object, make it reactive */
            if (Object.getPrototypeOf(value) == Object.prototype) {
                target[key] = createReactiveObject(value, callback);
                return true;
            }

            /* the property does not exist, so we create it */
            target[key] = value;

            /* if the value is an array, we should still run the callback */
            if (isArrayMode) callback(key, value);
            return true;
        },

        deleteProperty: (target, key, value) => {
            delete target[key];
            callback(key, value);
            return true;
        }
    };
}