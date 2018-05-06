/**
 * Created by yeanzhi on 17/4/12.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNamespacedHelpers = exports.mapActions = exports.mapGetters = exports.mapMutations = exports.mapState = exports.inject = exports.connect = exports.Store = undefined;

var _helper = require("./wmp-sara/helper");

Object.defineProperty(exports, "mapState", {
    enumerable: true,
    get: function get() {
        return _helper.mapState;
    }
});
Object.defineProperty(exports, "mapMutations", {
    enumerable: true,
    get: function get() {
        return _helper.mapMutations;
    }
});
Object.defineProperty(exports, "mapGetters", {
    enumerable: true,
    get: function get() {
        return _helper.mapGetters;
    }
});
Object.defineProperty(exports, "mapActions", {
    enumerable: true,
    get: function get() {
        return _helper.mapActions;
    }
});
Object.defineProperty(exports, "createNamespacedHelpers", {
    enumerable: true,
    get: function get() {
        return _helper.createNamespacedHelpers;
    }
});

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _connect2 = require("./wmp-sara/connect");

var _connect3 = _interopRequireDefault(_connect2);

var _inject2 = require("./wmp-sara/inject");

var _inject3 = _interopRequireDefault(_inject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Store = _store2.default;
exports.connect = _connect3.default;
exports.inject = _inject3.default;