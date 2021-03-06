var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
Page({
  onLoad: function(options) {

  },
  getUserInfo(e) {
    var that = this
    wx.showToast({
      title: "请稍后",
      icon: 'success',
      duration: 2000
    })
    common.upLog("获取用户信息=" + e.detail.errMsg);
    if (e.detail.errMsg === 'getUserInfo:ok') {
      var userInfo = e.detail.rawData;
      app.globalData.userInfo = userInfo;
      login(userInfo);
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'success',
        duration: 2000
      })
      common.upLog("获取用户信息失败" + e.detail.errMsg);
    }
  },
  cannelbtn: function(e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
});

//调用微信登录
function login(userInfo) {
  wx.login({
    //获取code
    success: function(res) {
      var code = res.code; //返回code
      save(userInfo, code);
    }
  })
};


//保存微信用户到服务器
function save(userInfo, code) {
  var user = JSON.parse(userInfo);
  var name = user.nickName;
  var photourl = user.avatarUrl;
  var age = user.gender;
  var country = user.country;
  var city = user.city;
  var province = user.province;
  var postUrl = serverUrl + 'user/save';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: {
      "sourceCode": "wechat",
      'nickName': name,
      'age': age,
      'country': country,
      'province': province,
      'city': city,
      'photoUrl': photourl,
      'code': code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message
      common.upLog("保存用户数据结束 message=" + message);
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      })
      if (code != 200) {
        return false;
      }
      var openid = res.data.data.openid; //返回openid
      var sessionKey = res.data.data.session_key; //返回session_key
      app.globalData.sessionKey = sessionKey;
      app.globalData.openId = openid;
      wx.switchTab({
        url: '../index/index'
      });
    }
  })
};