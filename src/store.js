/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
import invariant from "invariant";

import Module from "./module";
import { isObject, dispatch } from "./util";

export default class Store {
    constructor({ modules = {}, ...module } = {}) {
        this.registerModules(modules);
        this.registerModule("/", module);
    }
    _modulesNamespaceMap = {};

    get rootModule() {
        return this._modulesNamespaceMap["/"];
    }

    get state() {
        return this.rootModule.state;
    }
    get actions() {
        return this.rootModule.actions;
    }
    get mutations() {
        return this.rootModule.mutations;
    }
    get getters() {
        return this.rootModule.getters;
    }

    registerModules = (path = "", modules) => {
        for (let [key, module] of Object.entries(modules)) {
            this.registerModule(`${path}${key}`, module);
        }
    };

    registerModule = (path, module) => {
        invariant(!this.modules[path], "module must be unique");
        this._modulesNamespaceMap[path] = new Module(path, module, this);
    };

    unregisterModule = path => {};

    dispatch = (type, payload = {}, options = {}) => {
        if (!this._modulesNamespaceMap[type]) {
            return;
        }
        if (isObject(type)) {
            payload = type;
            type = type.type;
            options = payload;
        }
        this._modulesNamespaceMap[type](
            {
                state: this.modules[type].state,
                rootState: this.state,
                commit: this.commit,
                dispatch: this.dispatch,
                getters: this.getters
            },
            payload
        );
    };

    commit = (type, payload) => {
        if (this.mutations[type]) {
            this.mutations[type](state, payload);
        }
    };

    watch = () => {};

    subscribe = () => {};

    subscribeAction = () => {};
}
