/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _invariant = require("./libs/invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _module = require("./module");

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = (_temp = _class = function () {
    function Store() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref$modules = _ref.modules,
            modules = _ref$modules === undefined ? Object.create(null) : _ref$modules,
            module = _objectWithoutProperties(_ref, ["modules"]);

        _classCallCheck(this, Store);

        _initialiseProps.call(this);

        this._modulesNamespaceMap = Object.create(null);
        this.registerModules("", modules);
        this.registerModule("/", module);
        console.log(this._modulesNamespaceMap["/"].state);
    }

    _createClass(Store, [{
        key: "rootModule",
        get: function get() {
            return this._modulesNamespaceMap["/"];
        }
    }, {
        key: "state",
        get: function get() {
            console.log("store.js  rote state", this.rootModule);
            return this.rootModule.state;
        }
    }, {
        key: "actions",
        get: function get() {
            return this.rootModule.actions;
        }
    }, {
        key: "mutations",
        get: function get() {
            return this.rootModule.mutations;
        }
    }, {
        key: "getters",
        get: function get() {
            return this.rootModule.getters;
        }
    }, {
        key: "module",
        get: function get() {
            return this._modulesNamespaceMap;
        }
    }]);

    return Store;
}(), _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.registerModules = function () {
        var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var modules = arguments[1];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(modules)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    key = _step$value[0],
                    module = _step$value[1];

                _this.registerModule("" + path + key, module);
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
    };

    this.registerModule = function (path, module) {
        (0, _invariant2.default)(!_this._modulesNamespaceMap[path], "module must be unique");
        _this._modulesNamespaceMap[path] = new _module2.default(path, module, _this);
    };

    this.unregisterModule = function (path) {
        delete _this._modulesNamespaceMap[path];
    };

    this.dispatch = function (type) {
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { root: false };

        return _this.rootModule.dispatch(type, payload, options);
    };

    this.commit = function (type, payload) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { root: false };

        return _this.rootModule.commit(type, payload, options);
    };

    this.watch = function () {};

    this.subscribe = function () {};

    this.subscribeAction = function () {};
}, _temp);
exports.default = Store;