/* an object to use as the foundation for reactive objects */
class ReactiveObject {

    /* merge an object into this reactive object */
    set(obj) {
        this.prototype = Object.assign(this, obj);
    }
}

/* create a reactive object */
export function createReactiveObject(base, callback) {
    /* 
        we need to merge the object seperately to make sure
        nested properties are made reactive
    */
    const proxy = new Proxy(new ReactiveObject(), handleMutation(callback));
    proxy.set(base);

    return proxy;
}

/* create a reactive array */
export function createReactiveArray(base, callback) {
    return new Proxy(base, handleMutation(callback, true));
}

/* handle the mutation on a proxy */
function handleMutation(callback, isArrayMode = false) {
    return {
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
                target[key] = createReactiveArray(value, callback);
                return true;
            }

            /* the property does not exist, so we create it */
            target[key] = value;

            /* if the value is an array, we should still run the callback */
            if (isArrayMode) callback(key, value);
            return true;
        }
    };
}