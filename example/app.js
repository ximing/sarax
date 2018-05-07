//app.js
var {Store} = require('./sara/index.js')
const store = new Store({
  state: {
    count: 0,
    name:'sss'
  },
  mutations: {
    increment(state,count=1) {
      state.count += count;
    },
    setName(state,name="default name"){
      state.name = name;
    }
  },
  actions: {
    increment(context,payload) {
      context.commit('increment', payload)
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