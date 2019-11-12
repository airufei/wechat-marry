var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var num = 0;
var type=0;
Page({
  data: {
    personList: [{
        "name": "请选择",
        "value": 0
      },
      {
        "name": "1人",
        "value": 1
      },
      {
        "name": "2人",
        "value": 2
      },
      {
        "name": "3人",
        "value": 3
      },
      {
        "name": "4人",
        "value": 4
      },
      {
        "name": "5人",
        "value": 5
      },
      {
        "name": "其他",
        "value": 6
      }
    ],
    typeList: [{
      "name": "请选择",
      "value": 0
    },
    {
      "name": "参加男方宴席",
      "value": 1
    },
    {
      "name": "参加女方宴席",
      "value": 2
    },
    {
      "name": "都要参加",
      "value": 3
    }
    ],
    phone: "",
    remark: "",
    name: "",
    num: 0,
    type:0,
  },
  onLoad: function(options) {
    var that = this;
    getMeetDataByOpenId(that);
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    num = e.detail.value;
    this.setData({
      num: e.detail.value,
    })
  },
  bindTypePickerChange: function (e) {
    console.log('type 发送选择改变，携带值为', e.detail.value)
    type = e.detail.value;
    this.setData({
      type: e.detail.value,
    })
  },
  formSubmit: function(e) {
    common.userIsLogin();
    var openId = app.globalData.openId;
    if (openId == null || openId == undefined) {
      return;
    }
    var userName = e.detail.value.userName;
    var remark = e.detail.value.remark;
    var phone = e.detail.value.phone;
    var num = e.detail.value.num;
    var type = e.detail.value.type;
    var userInfo = app.globalData.userInfo;
    var user = JSON.parse(userInfo);
    var name = user.nickName;
    var face = user.avatarUrl;
    var jsonData = {
      "sourceCode": "wechat",
      'nickName': name,
      'photoUrl': face,
      'phone': phone,
      'num': num,
      'type': type,
      'userName': userName,
      'remark': remark,
      'openId': openId
    }
    sendMeet(jsonData);
  },
  getWxPhone: function(e) {
    var message = e.detail.errMsg;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var sessionkey = app.globalData.sessionKey;
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      getWxEnPhone(that, encryptedData, iv, sessionkey);
    }
  }
});

//获取参会信息
function getMeetDataByOpenId(that) {
  var openId = app.globalData.openId;
  if(openId==null||openId==undefined){
    return;
  }
  common.upLog("获取参会信息 openId:" + openId);
  var postUrl = serverUrl + 'meet/getMeeting';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: {
      "sourceCode": "wechat",
      'openId': openId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      var userName = res.data.data.userName;
      var remark = res.data.data.remark;
      var phone = res.data.data.phone;
      var num = res.data.data.num;
      var type = res.data.data.type;
      if (code == 200) {
        that.setData({
          userPhone: phone,
          remark: remark,
          name: userName,
          num: num,
          type: type,
        });
      }
    }
  })
}

//参会登记信息
function sendMeet(jsonData) {
  var postUrl = serverUrl + 'meet/save';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: jsonData,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      if (message == null || message == undefined) {
        message = "出现错误了，不好意思";
      }
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      })
    }
  })
};

//通过解密获取手机号
function getWxEnPhone(that, ency, iv, sessionkey) {
  common.userIsLogin();
  var openId = app.globalData.openId;
  if (openId == null || openId == undefined) {
    return;
  }
  var postUrl = serverUrl + 'user/getUserPhone';
  common.upLog("开始获取解密信息 sessionkey：" + sessionkey);
  wx.request({
    url: postUrl,
    method: 'POST',
    data: {
      "encrypdata": ency,
      "ivdata": iv,
      "sessionkey": sessionkey
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var phone = res.data.data;
      if (phone == null || phone == undefined) {
        phone = "";
      }
      common.upLog("通过解密获取手机号 phone=" + phone);
      that.setData({
        userPhone: phone
      })
    },
    fail: (res => {
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false
      });
    })
  })
};

//获取邀请函
function getInvitation(that) {
  var postUrl = serverUrl + 'invit/getInvitation';
  wx.request({
    url: postUrl,
    method: 'POST',
    data: {

    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code;
      var data = res.data.data;
      if (code != 200) {
        return false;
      }
      that.setData({
        invitation: data
      })
    }
  })
};