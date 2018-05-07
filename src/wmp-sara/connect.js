/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

import { autorun, isObservable, toJS, observable, extendObservable } from "mobx";
import { activate } from "../util";

export default function connect(options = {}, opt, ...args) {
    const { attached, detached } = options;
    opt = Object.assign({ componentName: "", delay: 0 }, opt);
    const propsDescriptor = Object.getOwnPropertyDescriptor(options, "props");
    const app = getApp();
    if (!propsDescriptor) {
        return Object.assign(options, ...args, {
            $store: app.$store
        });
    }
    Object.defineProperty(options, "props", { value: null });
    const autoRunFactory = (name = "", fn) => {
        return autorun(fn, {
            name: `${opt.componentName}/${name}`,
            ...opt
        });
    };
    const observerOptions = {
        $store: app.$store,
        autoRunList: [],

        reactiveState(key, value) {
            console.log("---->", "component reactiveState", key);
            this.setData({ [key]: isObservable(value) ? toJS(value) : value });
        },

        setAutoRun() {
            Object.keys(this.props).forEach(propName => {
                const prop = this.props[propName];
                if (typeof prop === "function") {
                    this.autoRunList.push(
                        autoRunFactory(`${propName}/function`, () => {
                            this.reactiveState(propName, prop.apply(this));
                        })
                    );
                } else if (isObservable(prop)) {
                    activate(prop);
                    this.autoRunList.push(
                        autoRunFactory(`${propName}/observable`, () => {
                            this.reactiveState(propName, prop);
                        })
                    );
                } else {
                    for (let [key, value] of Object.entries(prop)) {
                        activate(value);
                        if (!isObservable(value)) {
                            value = observable(value);
                        }
                        this.autoRunList.push(
                            autoRunFactory(`${propName}/map`, () => {
                                this.reactiveState(`${propName}.${key}`, value);
                            })
                        );
                    }
                }
            });
        },

        clearAutoRun() {
            this.autoRunList.forEach(func => func());
            this.autoRunList = [];
        },

        attached() {
            Object.defineProperty(this, "props", propsDescriptor);
            Object.defineProperty(this, "props", { value: this.props });
            this.setAutoRun();
            attached && attached.call(this, this.options);
        },

        detached() {
            this.clearAutoRun();
            detached && detached.call(this);
        }
    };
    return Object.assign(options, ...args, observerOptions);
}
