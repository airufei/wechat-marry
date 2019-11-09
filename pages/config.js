var xmf_server_url_pro = 'https://rufei.cn';
var xmf_server_url_dev = 'http://localhost:8082';
var app = getApp();

function getserverUrl() {
  return xmf_server_url_pro + "/wechat/";
}

function pageSize() {
  return 10;
};
//微信用户是否登录
function userIsLogin() {
  if (app == null || app == undefined) {
    return;
  }
  var openId = app.globalData.openId;
  if (openId == null || openId == undefined) {
    wx.redirectTo({
      url: '../login/login'
    })
  }
};
//上传日志
function upLog(logContent) {
  var postUrl = getserverUrl() + 'log/upLog';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: {
      'logContent': logContent
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
    }
  })
}
module.exports.getserverUrl = getserverUrl;
module.exports.userIsLogin = userIsLogin;
module.exports.pageSize = pageSize;
module.exports.upLog = upLog;