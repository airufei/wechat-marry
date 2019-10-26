var xmf_server_url_pro = 'https://rufei.cn';
var xmf_server_url_dev = 'http://localhost:8082';
var app = getApp();
function getserverUrl() {
  return xmf_server_url_dev + "/wechat/";
}
function getAppid() {
  return "wxf25e90199003dbdb";
};

function getSecret() {
  return "b32dc988ea15473d30234708ec801772";
};
function pageSize() {
  return 20;
};
//微信用户是否登录
function userIsLogin() {
  if (app == null || app == undefined) {
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
module.exports.getserverUrl = getserverUrl;
module.exports.getAppid = getAppid;
module.exports.getSecret = getSecret;
module.exports.userIsLogin = userIsLogin;
module.exports.pageSize = pageSize;

