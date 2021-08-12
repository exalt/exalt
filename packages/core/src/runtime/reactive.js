/* create reactive properties on an object */
export function createReactiveProperties(obj, indices, callback) {
    if (indices.length == 0) return;

    const names = Object.getOwnPropertyNames(obj);

    for (let index of indices) {
        let name = names[index];
        let value = obj[name];

        /* if the value is an array, turn it into a reactive array */
        if (Array.isArray(value)) {
            value = createReactiveArray(value, callback);
            Object.defineProperty(obj, name, {
                get: () => value,
                set: (newValue) => { callback(name, value = createReactiveArray(newValue, callback)); }
            });
        }

        /* if the value is an object, turn it into a reactive object */
        else if (isObject(value)) {
            value = createReactiveObject(value, callback);
            Object.defineProperty(obj, name, {
                get: () => value,
                set: (newValue) => { callback(name, value = Object.assign(value, newValue)); }
            });
        }

        /* if the value is a primitive, make it reactive */
        else {
            Object.defineProperty(obj, name, {
                get: () => value,
                set: (newValue) => { callback(name, value = newValue); }
            });
        }
    }
}

/* create a reactive object */
export function createReactiveObject(value, callback) {
    /* we merge the value with the proxy to ensure than nested values become reactive */
    return Object.assign(new Proxy({}, mutate(callback)), value);
}

/* create a reactive array */
export function createReactiveArray(value, callback) {
    /* we map nested properties to their reactive equivalents */
    return new Proxy(value.map((item) => {
        if (Array.isArray(item)) return createReactiveArray(item, callback);
        if (isObject(item)) return createReactiveObject(item, callback);
        return item;
    }), mutate(callback, true));
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
            if (Array.isArray(value) && key[0] != "_") {
                return (target[key] = createReactiveArray(value, callback));
            }

            /* if the property does not exist, and the value is an object, make it reactive */
            if (isObject(value) && key[0] != "_") {
                return (target[key] = createReactiveObject(value, callback));
            }

            /* the property does not exist, so we create it */
            target[key] = value;

            /* if the value is an array, we should still run the callback */
            if (isArrayMode) callback(key, value);
            return true;
        },

        deleteProperty: (target, key, value) => {
            if (Array.isArray(target)) return true;

            delete target[key];
            callback(key, value);
            return true;
        }
    };
}

/* check if an object is an object literal */
function isObject(value) {
    return (value != null && Object.getPrototypeOf(value) == Object.prototype);
}