/**
 * Created by ximing on 2018/5/6.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var isObject = exports.isObject = function isObject(obj) {
    return obj === Object(obj);
};
var dispatch = exports.dispatch = function dispatch(path, type, _dispatch, payload) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { root: false };

    return function () {
        if (opt.root) {
            return _dispatch(type, payload);
        } else {
            return _dispatch(path + "/" + type, payload);
        }
    };
};
var activate = exports.activate = function activate(store) {
    var descriptors = Object.getOwnPropertyDescriptors(store);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(descriptors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                name = _step$value[0],
                descriptor = _step$value[1];

            if (descriptor.get && !descriptor.enumerable) {
                descriptor.enumerable = true;
                Object.defineProperty(store, name, descriptor);
            }
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