/**
 * Created by ximing on 2018/5/6.
 */
"use strict";

import { autorun, isObservable, toJS } from "./libs/mobx";
import { activate } from "./util";

export default function connect(options = {}, ...args) {
    const { onLoad, onHide, onShow, onUnload } = options;
    const propsDescriptor = Object.getOwnPropertyDescriptor(options, "props");
    Object.defineProperty(options, "props", { value: null });

    const observerOptions = {
        autoRunList: [],

        reactiveCompute(key, value) {
            this.setData({ [key]: toJS(value) });
        },

        setAutoRun() {
            Object.keys(this.props).forEach(propName => {
                const prop = this.props[propName];
                if (isObservable(prop)) {
                    activate(prop);
                    this.autoRunList.push(autorun(() => this.reactiveCompute(propName, prop)));
                } else {
                    for (let [key, value] of Object.entries(prop)) {
                        activate(value);
                        this.autoRunList.push(
                            autorun(() => this.reactiveCompute(`${propName}.${key}`, value))
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

    return Page(Object.assign(options, ...args, observerOptions));
}
