//index.js
//获取应用实例
const app = getApp()
var { connect, inject,mapState, mapMutations } = require('../../sara/index.js')

Page(connect({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  props:{
    ...mapState({
      s:state=>state.count
    })
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
    console.log(e)
    console.log('+++++',this);
    app.$store.commit('increment',100)
  }
})
)