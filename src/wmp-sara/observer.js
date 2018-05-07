/**
 * Created by ximing on 2018/5/7.
 */
"use strict";
import { autorun, isObservable, toJS, observable, extendObservable } from "mobx";
import { activate } from "../util";
const autoRunFactory = (name = "", fn, opt) => {
    return autorun(fn, {
        name: `${opt.pageName}/${name}`,
        ...opt
    });
};

export default function(opt) {
    return {
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
                        autoRunFactory(
                            `${propName}/function`,
                            () => {
                                this.reactiveState(propName, prop.apply(this));
                            },
                            opt
                        )
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
        }
    };
}
