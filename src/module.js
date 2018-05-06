/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
import cloneDeep from "lodash.clonedeep";
import { isObject } from "./util";
import invariant from "invariant";
import { action, observable } from "./libs/mobx";

export default class Module {
    constructor(type, module, sara) {
        let { state, actions, mutations, getters, modules, namespaced } = cloneDeep({
            actions: {},
            state: {},
            getters: {},
            mutations: {},
            namespaced: false,
            modules: {},
            // prefix: "",
            ...module
        });
        invariant(isObject(actions), "actions should be object");
        invariant(isObject(getters), "getters should be object");
        invariant(isObject(mutations), "mutations should be object");
        this.modules = modules;
        this.namespaced = namespaced;
        this.state = observable(state);
        this.prefix = "";
        let key = type,
            _saraState = sara.state;
        type
            .split("/")
            .slice(0, -1)
            .forEach(_key => {
                this.prefix += `${_key}/`;
                _saraState = _saraState[_key];
                key = _key;
            });
        _saraState[key] = this.state;
        for (let [key, fn] of Object.entries(actions)) {
            this["actions"] = action(`${path}/${key}`, fn.bind(this));
        }
        for (let [key, fn] of Object.entries(getters)) {
            this["getters"] = action(`${path}/${key}`, fn.bind(this));
        }
        for (let [key, fn] of Object.entries(mutations)) {
            this["mutations"] = action(`${path}/${key}`, fn.bind(this));
        }

        if (module.namespaced && module.modules) {
            sara.registerModules(`${path}/`, module.modules);
        }
    }

    dispatch = () => {};

    commit = () => {};
}
