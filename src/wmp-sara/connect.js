/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

import { autorun, isObservable, toJS, observable, extendObservable } from "mobx";
import observer from "./observer";

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

    const observerOptions = Object.assign(
        {
            $store: app.$store,

            attached() {
                this.$data = observable(this.data);
                let _setData = this.setData;
                let hookSetData = data => {
                    for (let [key, item] of Object.entries(data)) {
                        this.$data[key] = item;
                    }
                    _setData.call(this, data);
                };
                Object.defineProperty(this, "setData", {
                    get() {
                        return hookSetData;
                    }
                });
                Object.defineProperty(this, "props", propsDescriptor);
                Object.defineProperty(this, "props", { value: this.props });
                this.setAutoRun();
                attached && attached.call(this, this.options);
            },

            detached() {
                this.clearAutoRun();
                detached && detached.call(this);
            }
        },
        observer(opt)
    );
    return Object.assign(options, ...args, observerOptions);
}
