/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
import invariant from "invariant";
import Module from "./module";

export default class Store {
    constructor({ modules = Object.create(null), ...module } = {}) {
        this._modulesNamespaceMap = Object.create(null);
        this.registerModules("", modules);
        this.registerModule("/", module);
    }
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

    get module() {
        return this._modulesNamespaceMap;
    }

    registerModules = (path = "", modules) => {
        for (let [key, module] of Object.entries(modules)) {
            this.registerModule(`${path}${key}`, module);
        }
    };

    registerModule = (path, module) => {
        invariant(!this._modulesNamespaceMap[path], "module must be unique");
        this._modulesNamespaceMap[path] = new Module(path, module, this);
    };

    unregisterModule = path => {
        delete this._modulesNamespaceMap[path];
    };

    dispatch = (type, payload = {}, options = { root: false }) => {
        return this.rootModule.dispatch(type, payload, options);
    };

    commit = (type, payload, options = { root: false }) => {
        return this.rootModule.commit(type, payload, options);
    };

    watch = () => {};

    subscribe = () => {};

    subscribeAction = () => {};
}
