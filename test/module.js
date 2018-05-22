/**
 * Created by ximing on 2018/5/22.
 */
"use strict";
import test from "ava";
import { createStore } from "./help";

test("increment", t => {
    let store = createStore();
    store.commit("a/increment");
    t.is(store.state.count, 0);
    t.is(store.state.a.count, 1);
});

test("actions increment", t => {
    let store = createStore();
    store.dispatch("a/increment", 100);
    t.is(store.state.count, 0);
    t.is(store.state.a.count, 100);
    store.dispatch("a/allIncrement", 66);
    t.is(store.state.count, 66);
    t.is(store.state.a.count, 166);
});
