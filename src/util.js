/**
 * Created by ximing on 2018/5/6.
 */

"use strict";
export const isObject = function(obj) {
    return obj === Object(obj);
};

export const activate = function(store) {
    const descriptors = Object.getOwnPropertyDescriptors(store);
    for (let [name, descriptor] of Object.entries(descriptors)) {
        if (descriptor.get && !descriptor.enumerable) {
            descriptor.enumerable = true;
            Object.defineProperty(store, name, descriptor);
        }
    }
};
export const type = function(v) {
    return Object.prototype.toString
        .call(v)
        .slice(8, -1)
        .toLowerCase();
};

export const splitNamespace = function(path = "", rootPrefix = true) {
    let res = path.split("/");
    return {
        namespace:
            res.length === 1 ? (rootPrefix ? "/" : "") : res.slice(0, res.length - 1).join("/"),
        fnName: res.length === 1 ? path : res[res.length - 1]
    };
};
