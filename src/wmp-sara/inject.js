/**
 * Created by ximing on 2018/5/6.
 */
"use strict";
export default function inject(target) {
    const app = getApp();
    target.$store = app.$store;
    return target;
}
