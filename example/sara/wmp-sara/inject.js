/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = inject;
function inject(target) {
    var app = getApp();
    target.$store = app.$store;
    return target;
}