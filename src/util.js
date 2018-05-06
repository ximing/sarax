/**
 * Created by ximing on 2018/5/6.
 */

"use strict";
export const isObject = function(obj) {
    return obj === Object(obj);
};
export const dispatch = function(path, type, _dispatch, payload, opt = { root: false }) {
    return () => {
        if (opt.root) {
            return _dispatch(type, payload);
        } else {
            return _dispatch(`${path}/${type}`, payload);
        }
    };
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
