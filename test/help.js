/**
 * Created by ximing on 2018/5/22.
 */
"use strict";
import { Store } from "../src/index.js";
const moduleA = {
    state: { count: 0 },
    namespaced: true,
    mutations: {
        increment(state, count = 1) {
            // 这里的 `state` 对象是模块的局部状态
            state.count += count;
        }
    },
    actions: {
        increment(context, payload) {
            context.commit("increment", payload);
        },
        allIncrement(context, payload) {
            context.commit("increment", payload);
            context.commit("increment", payload, { root: true });
        }
    },
    getters: {
        doubleCount(state) {
            return state.count * 2;
        }
    }
};
export function createStore() {
    return new Store({
        modules: {
            a: moduleA
        },
        state: {
            count: 0,
            name: "sss"
        },
        mutations: {
            increment(state, count = 1) {
                state.count += count;
            },
            setName(state, name = "default name") {
                state.name = name;
            }
        },
        actions: {
            increment(context, payload) {
                context.commit("increment", payload);
            }
        },
        getters: {
            all(state) {
                return state.count + 100;
            }
        }
    });
}
