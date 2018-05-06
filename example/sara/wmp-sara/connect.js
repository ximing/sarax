/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = connect;

var _mobx = require("../libs/mobx");

var _util = require("../util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function connect() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var opt = arguments[1];
    var _onLoad = options.onLoad,
        _onHide = options.onHide,
        _onShow = options.onShow,
        _onUnload = options.onUnload;

    opt = Object.assign({ componentName: "", delay: 0 }, opt);
    var propsDescriptor = Object.getOwnPropertyDescriptor(options, "props");
    Object.defineProperty(options, "props", { value: null });
    var app = getApp();
    var autoRunFactory = function autoRunFactory() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var fn = arguments[1];

        return (0, _mobx.autorun)(fn, _extends({
            name: opt.componentName + "/" + name
        }, opt));
    };
    var observerOptions = {
        $store: app.$store,
        autoRunList: [],

        reactiveState: function reactiveState(key, value) {
            console.log("---->", "reactiveState", key);
            this.setData(_defineProperty({}, key, (0, _mobx.isObservable)(value) ? (0, _mobx.toJS)(value) : value));
        },
        setAutoRun: function setAutoRun() {
            var _this = this;

            Object.keys(this.props).forEach(function (propName) {
                var prop = _this.props[propName];
                if (typeof prop === "function") {
                    _this.autoRunList.push(autoRunFactory(propName + "/function", function () {
                        _this.reactiveState(propName, prop.apply(_this));
                    }));
                } else if ((0, _mobx.isObservable)(prop)) {
                    (0, _util.activate)(prop);
                    _this.autoRunList.push(autoRunFactory(propName + "/observable", function () {
                        _this.reactiveState(propName, prop);
                    }));
                } else {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        var _loop = function _loop() {
                            var _step$value = _slicedToArray(_step.value, 2),
                                key = _step$value[0],
                                value = _step$value[1];

                            (0, _util.activate)(value);
                            if (!(0, _mobx.isObservable)(value)) {
                                value = (0, _mobx.observable)(value);
                            }
                            _this.autoRunList.push(autoRunFactory(propName + "/map", function () {
                                _this.reactiveState(propName + "." + key, value);
                            }));
                        };

                        for (var _iterator = Object.entries(prop)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            _loop();
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
                }
            });
        },
        clearAutoRun: function clearAutoRun() {
            this.autoRunList.forEach(function (func) {
                return func();
            });
            this.autoRunList = [];
        },
        onLoad: function onLoad() {
            Object.defineProperty(this, "props", propsDescriptor);
            Object.defineProperty(this, "props", { value: this.props });
            this.setAutoRun();
            _onLoad && _onLoad.call(this, this.options);
        },


        //性能提升，不可见就不反应
        onShow: function onShow() {
            this.autoRunList.length === 0 && this.setAutoRun();
            _onShow && _onShow.call(this);
        },
        onUnload: function onUnload() {
            this.clearAutoRun();
            _onUnload && _onUnload.call(this);
        },
        onHide: function onHide() {
            this.clearAutoRun();
            _onHide && _onHide.call(this);
        }
    };

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    return Object.assign.apply(Object, [options].concat(args, [observerOptions]));
}