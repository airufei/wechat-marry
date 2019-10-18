
//获取应用实例
var app = getApp()

Page({
  data: {
    logo: 'https://pengmaster.com/party/wechat/marry/gwtx_zip/HY2A1088.jpg',
    appName: "Marry"
  },
  onLoad: function(options) {

  },
  getUserInfo(e) {
    var that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      console.log('获取用户信息成功')
      app.globalData.userInfo = e.detail.rawData
      wx.switchTab({
        url: '../index/index'
      });
      console.log('app.globalData.userInfo', app.globalData.userInfo)
    } else {
      console.log('fail', '获取用户信息失败')
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败',
        showCancel: false,
        confirmColor: '#e2211c'
      })
    }
  }
})