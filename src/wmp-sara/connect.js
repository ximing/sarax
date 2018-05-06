/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

import { autorun, isObservable, toJS, observable, extendObservable } from "../libs/mobx";
import { activate } from "../util";

export default function connect(options = {}, opt, ...args) {
    const { onLoad, onHide, onShow, onUnload } = options;
    opt = Object.assign({ componentName: "", delay: 0 }, opt);
    const propsDescriptor = Object.getOwnPropertyDescriptor(options, "props");
    Object.defineProperty(options, "props", { value: null });
    const app = getApp();
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
            this.setData({ [key]: isObservable(value) ? toJS(value) : value });
        },

        setAutoRun() {
            Object.keys(this.props).forEach(propName => {
                const prop = this.props[propName];
                console.log("prop name", propName, prop, isObservable(prop));
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

        onLoad() {
            Object.defineProperty(this, "props", propsDescriptor);
            Object.defineProperty(this, "props", { value: this.props });
            console.log("onLoad", app.$store._modulesNamespaceMap["/"].state);
            this.setAutoRun();
            onLoad && onLoad.call(this, this.options);
        },

        //性能提升，不可见就不反应
        onShow() {
            this.autoRunList.length === 0 && this.setAutoRun();
            onShow && onShow.call(this);
        },

        onUnload() {
            this.clearAutoRun();
            onUnload && onUnload.call(this);
        },

        onHide() {
            this.clearAutoRun();
            onHide && onHide.call(this);
        }
    };
    return Object.assign(options, ...args, observerOptions);
}
