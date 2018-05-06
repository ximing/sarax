//index.js
//获取应用实例
const app = getApp()
var { connect, inject, mapState, mapMutations, mapGetters } = require('../../sara/index.js')

Page(connect({
  data: {
    motto: 'Hello World',
    userInfo: {}
      },
  props:{
    ...mapState({
      s:state=>state.count
    }),
    ...mapGetters(['all'])
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(this.data, this.props)
  },
  getUserInfo: function(e) {
    console.log('+++++');
    app.$store.commit('increment',100)
  }
})
)