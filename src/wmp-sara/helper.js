/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
const app = getApp();

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
export const mapState = normalizeNamespace((namespace, states) => {
    const res = {};
    normalizeMap(states).forEach(({ key, val }) => {
        res[key] = function mappedState() {
            let state = app.$store.state;
            let getters = app.$store.getters;
            if (namespace) {
                const module = getModuleByNamespace(app.$store, "mapState", namespace);
                if (!module) {
                    return;
                }
                state = module.state;
                getters = module.getters;
            }
            return typeof val === "function" ? val.call(this, state, getters) : state[val];
        };
    });
    return res;
});

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept anthor params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
export const mapMutations = normalizeNamespace((namespace, mutations) => {
    const res = {};
    normalizeMap(mutations).forEach(({ key, val }) => {
        res[key] = function mappedMutation(...args) {
            // Get the commit method from store
            let commit = app.$store.commit;
            if (namespace) {
                const module = getModuleByNamespace(app.$store, "mapMutations", namespace);
                if (!module) {
                    return;
                }
                commit = module.commit;
            }
            return typeof val === "function"
                ? val.apply(this, [commit].concat(args))
                : commit.apply(app.$store, [val].concat(args));
        };
    });
    return res;
});

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
export const mapGetters = normalizeNamespace((namespace, getters) => {
    const res = {};
    normalizeMap(getters).forEach(({ key, val }) => {
        // thie namespace has been mutate by normalizeNamespace
        val = namespace + val;
        res[key] = function mappedGetter() {
            if (namespace && !getModuleByNamespace(app.$store, "mapGetters", namespace)) {
                return;
            }
            if (process.env.NODE_ENV !== "production" && !(val in app.$store.getters)) {
                console.error(`[vuex] unknown getter: ${val}`);
                return;
            }
            return app.$store.getters[val];
        };
    });
    return res;
});

/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the first param, it can accept anthor params. You can dispatch action and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
export const mapActions = normalizeNamespace((namespace, actions) => {
    const res = {};
    normalizeMap(actions).forEach(({ key, val }) => {
        res[key] = function mappedAction(...args) {
            // get dispatch function from store
            let dispatch = app.$store.dispatch;
            if (namespace) {
                const module = getModuleByNamespace(app.$store, "mapActions", namespace);
                if (!module) {
                    return;
                }
                dispatch = module.context.dispatch;
            }
            return typeof val === "function"
                ? val.apply(this, [dispatch].concat(args))
                : dispatch.apply(app.$store, [val].concat(args));
        };
    });
    return res;
});

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
    return Array.isArray(map)
        ? map.map(key => ({ key, val: key }))
        : Object.keys(map).map(key => ({ key, val: map[key] }));
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace(fn) {
    return (namespace, map) => {
        if (typeof namespace !== "string") {
            map = namespace;
            namespace = "";
        }
        return fn(namespace, map);
    };
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace(store, helper, namespace) {
    const module = store._modulesNamespaceMap[namespace];
    if (process.env.NODE_ENV !== "production" && !module) {
        console.error(`[sara] module namespace not found in ${helper}(): ${namespace}`);
    } else if (namespace.charAt(namespace.length - 1) !== "/") {
        namespace += "/";
    }
    return module;
}

/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */
export const createNamespacedHelpers = namespace => ({
    mapState: mapState.bind(null, namespace),
    mapGetters: mapGetters.bind(null, namespace),
    mapMutations: mapMutations.bind(null, namespace),
    mapActions: mapActions.bind(null, namespace)
});
