var xmf_server_url_pro = 'https://rufei.cn';
var xmf_server_url_dev = 'http://localhost:8082';
var app = getApp();

function getserverUrl() {
  return xmf_server_url_dev + "/wechat/";
};

function getAppid() {
  return "wxf25e90199003dbdb";
};

function getSecret() {
  return "b32dc988ea15473d30234708ec801772";
};

//存储本地缓存
function saveCache(key, value) {
  try {
    var cacheValue = wx.getStorageSync(key);
    value = cacheValue + value;
    wx.setStorageSync(key, value);
  } catch (e) {
    console.log(e)
  }
}
//清除缓存
function clearCache(key) {
  wx.removeStorage({
    key: key,
    success(res) {
      console.log(res)
    }
  })
}
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
module.exports.saveCache = saveCache;
module.exports.clearCache = clearCache;