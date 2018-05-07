/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
import { autorun, isObservable, toJS, observable, reaction } from "mobx";
import observer from "./observer";

export default function inject(options = {}, opt, ...args) {
    const { onLoad, onHide, onShow, onUnload } = options;
    opt = Object.assign({ pageName: "", delay: 0 }, opt);
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
            onLoad() {
                this.$data = observable(this.data);
                reaction(
                    () => toJS(this.$data),
                    $data => {
                        console.log("$data", $data);
                        this.setData($data, false);
                    }
                );
                let _setData = this.setData;
                let hookSetData = (data, native = true) => {
                    if (native) {
                        for (let [key, item] of Object.entries(data)) {
                            this.$data[key] = item;
                        }
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
        },
        observer(opt)
    );
    return Object.assign(options, ...args, observerOptions);
}
