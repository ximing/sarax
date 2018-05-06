/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mapState = exports.mapState = normalizeNamespace(function (namespace, states) {
    var res = {};
    var app = getApp();
    normalizeMap(states).forEach(function (_ref) {
        var key = _ref.key,
            val = _ref.val;

        res[key] = function mappedState() {
            var state = app.$store.state;
            var getters = app.$store.getters;
            if (namespace) {
                var module = getModuleByNamespace(app.$store, "mapState", namespace);
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
var mapMutations = exports.mapMutations = normalizeNamespace(function (namespace, mutations) {
    var res = {};
    var app = getApp();
    normalizeMap(mutations).forEach(function (_ref2) {
        var key = _ref2.key,
            val = _ref2.val;

        res[key] = function mappedMutation() {
            // Get the commit method from store
            var commit = app.$store.commit;
            if (namespace) {
                var module = getModuleByNamespace(app.$store, "mapMutations", namespace);
                if (!module) {
                    return;
                }
                commit = module.commit;
            }

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return typeof val === "function" ? val.apply(this, [commit].concat(args)) : commit.apply(app.$store, [val].concat(args));
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
var mapGetters = exports.mapGetters = normalizeNamespace(function (namespace, getters) {
    var res = {};
    var app = getApp();
    normalizeMap(getters).forEach(function (_ref3) {
        var key = _ref3.key,
            val = _ref3.val;

        // thie namespace has been mutate by normalizeNamespace
        val = namespace + val;
        res[key] = function mappedGetter() {
            // if (namespace && !getModuleByNamespace(app.$store, "mapGetters", namespace)) {
            //     return;
            // }
            if (namespace) {
                var module = getModuleByNamespace(app.$store, "mapGetters", namespace);
                if (!module || !(val in module.getters)) {
                    console.error("[sarax] unknown getter: " + namespace + " " + val);
                    return;
                }
                return module.getters[val];
            }
            console.log("app.$store.getters", app.$store.getters);
            if (!(val in app.$store.getters)) {
                console.error("[sarax] unknown getter: " + val);
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
var mapActions = exports.mapActions = normalizeNamespace(function (namespace, actions) {
    var res = {};
    var app = getApp();
    normalizeMap(actions).forEach(function (_ref4) {
        var key = _ref4.key,
            val = _ref4.val;

        res[key] = function mappedAction() {
            // get dispatch function from store
            var dispatch = app.$store.dispatch;
            if (namespace) {
                var module = getModuleByNamespace(app.$store, "mapActions", namespace);
                if (!module) {
                    return;
                }
                dispatch = module.context.dispatch;
            }

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return typeof val === "function" ? val.apply(this, [dispatch].concat(args)) : dispatch.apply(app.$store, [val].concat(args));
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
    return Array.isArray(map) ? map.map(function (key) {
        return { key: key, val: key };
    }) : Object.keys(map).map(function (key) {
        return { key: key, val: map[key] };
    });
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace(fn) {
    return function (namespace, map) {
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
    var module = store._modulesNamespaceMap[namespace];
    if (!module) {
        console.error("[sara] module namespace not found in " + helper + "(): " + namespace);
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
var createNamespacedHelpers = exports.createNamespacedHelpers = function createNamespacedHelpers(namespace) {
    return {
        mapState: mapState.bind(null, namespace),
        mapGetters: mapGetters.bind(null, namespace),
        mapMutations: mapMutations.bind(null, namespace),
        mapActions: mapActions.bind(null, namespace)
    };
};