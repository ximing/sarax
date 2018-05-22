//app.js
var { Store } = require("./sara/index.js");
const moduleA = {
    state: { count: 0 },
    namespaced: true,
    mutations: {
        increment(state) {
            // 这里的 `state` 对象是模块的局部状态
            state.count++;
        }
    },
    getters: {
        doubleCount(state) {
            return state.count * 2;
        }
    }
};
const store = new Store({
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
App({
    $store: store,
    onLaunch: function() {},
    globalData: {
        userInfo: null
    }
});
