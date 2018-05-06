/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

var _lodash = require("./libs/lodash.clonedeep");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("./libs/lodash.trim");

var _lodash4 = _interopRequireDefault(_lodash3);

var _util = require("./util");

var _invariant = require("./libs/invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _mobx = require("./libs/mobx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = (_temp = _class = function Module(namespace, module, runtime) {
    var _this = this;

    _classCallCheck(this, Module);

    _initialiseProps.call(this);

    var _cloneDeep = (0, _lodash2.default)(_extends({
        actions: {},
        state: {},
        getters: {},
        mutations: {},
        namespaced: false,
        modules: {}
    }, module)),
        state = _cloneDeep.state,
        actions = _cloneDeep.actions,
        mutations = _cloneDeep.mutations,
        getters = _cloneDeep.getters,
        modules = _cloneDeep.modules,
        namespaced = _cloneDeep.namespaced;

    (0, _invariant2.default)((0, _util.isObject)(actions), "actions should be object");
    (0, _invariant2.default)((0, _util.isObject)(getters), "getters should be object");
    (0, _invariant2.default)((0, _util.isObject)(mutations), "mutations should be object");
    this.modules = modules;
    this.state = (0, _mobx.extendObservable)(this, state);
    this.namespaced = namespaced;
    this.prefix = "";
    this.namespace = namespace;
    this.runtime = runtime;
    this.actions = {};
    this.getters = {};
    this.mutations = {};
    var key = namespace;
    namespace = (0, _lodash4.default)(namespace, "/");
    if (namespace !== "") {
        var _saraState = runtime.state;
        namespace.split("/").slice(0, -1).forEach(function (_key) {
            _this.prefix += _key + "/";
            _saraState = _saraState[_key];
            key = _key;
        });
        _saraState[key] = this.state;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(actions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                _key2 = _step$value[0],
                fn = _step$value[1];

            this["actions"][_key2] = (0, _mobx.action)(namespace + "/" + _key2, fn.bind(this));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.entries(getters)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                _key3 = _step2$value[0],
                fn = _step2$value[1];

            this["getters"][_key3] = (0, _mobx.computed)(fn, {
                name: namespace + "/" + _key3,
                context: this
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Object.entries(mutations)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                _key4 = _step3$value[0],
                fn = _step3$value[1];

            this["mutations"][_key4] = (0, _mobx.action)(namespace + "/" + _key4, fn.bind(this));
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    if (module.namespaced && module.modules) {
        runtime.registerModules("" + (namespace === "/" ? "" : "/"), module.modules);
    }
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._baseModuleCall = function (scope, args, type, payload) {
        var _runtime$_modulesName;

        var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { root: false };

        if ((0, _util.isObject)(type)) {
            payload = type;
            if (!type.type) {
                throw new Error("type is required");
            }
            type = type.type;
            options = Object.assign(options, payload);
        }
        if (!options.root) {
            type = "" + _this2.prefix + type;
        }
        var namespace = type.split("/");
        var fnName = namespace.pop();
        namespace = namespace.join("/") || "/";
        if (!_this2.runtime._modulesNamespaceMap[namespace]) {
            console.error("can't find " + namespace + " module");
            return;
        }
        if (!_this2.runtime._modulesNamespaceMap[namespace][scope][fnName]) {
            console.error("can't find " + fnName + "() in module['" + namespace + "']['" + scope + "']");
            return;
        }
        return (_runtime$_modulesName = _this2.runtime._modulesNamespaceMap[namespace][scope])[fnName].apply(_runtime$_modulesName, _toConsumableArray(args));
    };

    this.commit = function () {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.namespace;
        var payload = arguments[1];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { root: false };

        return _this2._baseModuleCall("mutations", [_this2.state, payload], type, payload, options);
    };

    this.dispatch = function () {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.namespace;
        var payload = arguments[1];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { root: false };

        return _this2._baseModuleCall("actions", [{
            state: _this2.state,
            rootState: _this2.runtime.state,
            commit: function commit() {
                var _runtime;

                return (_runtime = _this2.runtime).commit.apply(_runtime, arguments);
            },
            dispatch: function dispatch() {
                var _runtime2;

                return (_runtime2 = _this2.runtime).dispatch.apply(_runtime2, arguments);
            },
            getters: _this2.getters,
            rootGetters: _this2.runtime.rootGetters
        }, payload], type, payload, options);
    };
}, _temp);
exports.default = Module;