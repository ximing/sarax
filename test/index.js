/**
 * Created by yeanzhi on 17/6/1.
 */
"use strict";
import test from "ava";
import {createStore} from './help'

test("increment", t => {
    let store = createStore();
    store.commit("increment");
    t.is(store.state.count, 1);
});

test("increment with object style", t => {
    let store = createStore();
    store.commit("increment", 100);
    t.is(store.state.count, 100);
});

test("dispatching actions sync", t => {
    let store = createStore();
    store.dispatch("increment", 100);
    t.is(store.state.count, 100);
});
