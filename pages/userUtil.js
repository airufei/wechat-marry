var app = getApp();
var common = require("config.js");
var serverUrl = common.getserverUrl();
var appid = common.getAppid();
var secret = common.getSecret();
//微信用户是否登录
function userIsLogin () {
  if (app == null || app==undefined){
    return;
  }
  var user = app.globalData.userInfo;
  var openId = app.globalData.openId
  if (user == null && openId == null) {
    wx.navigateTo({
      url: '../login/login'
    });
    return;
  }
  var that = this;
  login(user);
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
    data: { 'nickname': name, 'age': age, 'country': country, 'province': province, 'city': city, 'photourl': photourl, 'openId': openid },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(postUrl);
    }
  })
};