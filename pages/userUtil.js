var app = getApp();
var common = require("config.js");
var serverUrl = common.getserverUrl();
var appid = common.getAppid();
var secret = common.getSecret();
//微信用户是否登录
function userIsLogin () {
  var user = app.globalData.userInfo;
  var user = app.globalData.userInfo;
  var openId = app.globalData.openId
  if (user != null && openId != null) {
    return;
  }
  var that = this
  //调用应用实例的方法获取全局数据
  app.getUserInfo(function (userInfo) {
    login(userInfo);
    app.globalData.userInfo = userInfo;
  })
};
module.exports.userIsLogin = userIsLogin;
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
      app.globalData.openId = openid;
      save(userInfo, openid)
      console.log("opendid:====" + openid);
    }
  })
};
//保存微信用户到服务器
function save(userInfo, openid) {
  var nickname = userInfo.nickName;
  var age = userInfo.gender;
  var country = userInfo.country;
  var city = userInfo.city;
  var province = userInfo.province;
  var photourl = userInfo.avatarUrl;
  var postUrl = serverUrl + 'user/save';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: { 'nickname': nickname, 'age': age, 'country': country, 'province': province, 'city': city, 'photourl': photourl, 'openId': openid },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(postUrl);
    }
  })
};