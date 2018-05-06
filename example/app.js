//app.js
var {Store} = require('./sara/index.js')
const store = new Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state,count=1) {
      state.count += count;
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  getters:{
    all(state){
      return state.count+100;
    }
  }
})
App({
  $store: store,
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  }
})