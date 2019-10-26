var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
Page({
  onLoad: function(options) {
    common.userIsLogin();
  },
  bindNmaeInput: function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindPersonCountInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  bindRemarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  sendMeet: function (e) {
    var that = this
    sendMeet(that);
  }
});
//参会登记信息
function sendMeet(that) {
  var postUrl = serverUrl + 'meet/save';
  //留言内容不是空值
  var userInfo = app.globalData.userInfo;
  if (userInfo == null || userInfo == undefined) {
    wx.navigateTo({
      url: '../login/login'
    });
    return;
  }
  var user = JSON.parse(userInfo);
  var name = user.nickName;
  var face = user.avatarUrl;
  var userName = that.data.userName;
  var phone = that.data.phone;
  var num = that.data.num;
  var remark = that.data.remark;
  if (!checkName(userName)) {
    wx.showModal({
      title: '提示',
      content: '请填写正确姓名',
      showCancel: false
    })
    return false;
  }
  if (!checkNum(num)) {
    wx.showModal({
      title: '提示',
      content: '只能数字',
      showCancel: false
    })
    return false;
  }
  if (!checkPhone(phone)) {
    wx.showModal({
      title: '提示',
      content: '手机号不正确',
      showCancel: false
    })
    return false;
  }
  wx.request({
    url: postUrl,
    method: 'POST',
    data: { 
      'nickName': name,
      'photoUrl': face,
      'phone': phone,
      'num': num,
      'userName': userName,
      'remark': remark,
      'openId': app.globalData.openId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code;
      var message = res.data.message;
      if (message == null || message==undefined)
      {
        message="出现错误了，不好意思";
      }
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      })
      return false;
    }
  })
};


function checkPhone(phone) {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  return reg.test(phone);
}

function checkName(userName) {
  if (userName == null || userName == undefined) {
    return false;
  }
  if (userName.length<2|| userName>=20) {
    return false;
  }
  return true;
}
function checkNum(phone) {
  const reg = /^[0-9]+$/;
  return reg.test(phone);
}