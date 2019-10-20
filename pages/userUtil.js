var app = getApp();
var common = require("config.js");
//微信用户是否登录
function userIsLogin () {
  if (app == null || app==undefined){
    return;
  }
  var user = app.globalData.userInfo;
  var openId = app.globalData.openId
  if (user == null || user == undefined) {
    wx.redirectTo({
      url: '../login/login'
    })
    return;
  }
  var that = this;
};
module.exports.userIsLogin = userIsLogin;
