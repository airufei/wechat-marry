var app = getApp();
var common = require("../config.js");
var appid = common.getAppid();
var secret = common.getSecret();
var serverUrl = common.getserverUrl();
Page({
  onLoad: function(options) {

  },
  getUserInfo(e) {
    var that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      console.log('获取用户信息成功')
      var userInfo= e.detail.rawData;
      app.globalData.userInfo = userInfo;
      login(userInfo);
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
});

//调用微信登录
function login(userInfo) {
  wx.login({
    //获取code
    success: function (res) {
      var code = res.code; //返回code
      getOpenId(code, userInfo);
    }
  })
};
//获取微信openID
function getOpenId(code, userInfo) {
  wx.request({
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      var openid = res.data.openid; //返回openid
      var sessionKey = res.data.session_key; //返回session_key
      app.globalData.sessionKey = sessionKey;
      app.globalData.openId = openid;
      save(userInfo, openid)
      console.log("opendid:====" + openid);
    }
  })
};
//保存微信用户到服务器
function save(userInfo, openid) {
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
    data: { 'nickName': name, 'age': age, 'country': country, 'province': province, 'city': city, 'photoUrl': photourl, 'openId': openid },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(postUrl);
    }
  })
};