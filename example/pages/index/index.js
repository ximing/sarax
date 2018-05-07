//index.js
//获取应用实例
const app = getApp()
var { connect, inject, mapState, mapMutations, mapGetters } = require('../../sara/index.js')

Page(inject({
  data: {
    motto: 'Hello',
    userInfo: {}
  },
  props:{
    ...mapState({
      s: function (state) { return state.count+this.$data.motto},
      name: state => state.name
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
  incrementCommit: function(e) {
    console.log('+++++');
    app.$store.commit('increment',100)
  },
  incrementAction: function(){
    app.$store.dispatch('increment',5)
  },
  setName: function(){
    app.$store.commit('setName')
  },
  changeMotto:function(){
    this.setData({
      motto:'nihao',
      test:"sssaaa"
    })
    setTimeout(()=>{
      this.$data = { motto: '12345'} 
    },1000)
  }
})
)