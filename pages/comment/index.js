var app = getApp();
var common = require("../config.js");
var userUtil = require("../userUtil.js");
var serverUrl = common.getserverUrl();
var pageNo = 1;
var pageSize = 10;
Page({
  data: {
    commentList: [],
  },
  onLoad: function(options) {
    //设置第一次数据
    userUtil.userIsLogin();
    wx.startPullDownRefresh;
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getMsgList(that, isConcat);
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("监听用户下拉动作");
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getMsgList(that, isConcat);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("监听用户上拉拉动作");
    var that = this;
    pageNo = pageNo + 1;
    var isConcat = true;
    getMsgList(that, isConcat);
  },
  //提交评论
  comment: function() {
    var that = this;
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
    var words = that.data.inputValue;
    if (words == null || words == undefined) {
      wx.showModal({
        title: '提示',
        content: '您还没有填写内容',
        showCancel: false
      })
      return false;
    }
    wx.request({
      url: serverUrl + '/msg/save',
      method: 'POST',
      data: {
        'nickname': name,
        'photourl': face,
        'content': words,
        'type': 'common_comment',
        'openId': app.globalData.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        var code = res.data.code
        var message = res.data.message
        if (code != 200) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
          return false;
        }
        pageNo = 1;
        var isConcat = false;
        getMsgList(that, isConcat);
      }
    })
    that.setData({
      inputValue: '' //将data的inputValue清空
    });
    return;
  }
});

//获取留言列表
var getMsgList = function(that, isConcat) {
  that.setData({
    bottom_msg: "加载中..."
  });
  var type = "common_comment";
  wx.request({
    url: serverUrl + '/msg/getList',
    method: 'POST',
    data: {
      "pageNo": pageNo,
      "pageSize": pageSize,
      "type": type
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code
      var message = res.data.message
      if (code != 200) {
        that.setData({
          bottom_msg: "----没有了----"
        });
        return false;
      }
      var list = res.data.data.list;
      if (isConcat) {
        list = that.data.commentList.concat(res.data.data.list);
      }
      that.setData({
        commentList: list,
        bottom_msg: "加载更多"
      });
    }
  })
}