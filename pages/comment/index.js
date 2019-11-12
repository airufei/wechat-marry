var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo = 1;
var pageSize = common.pageSize();
var totalCount = 0;
Page({
  data: {
    commentList: [],
    bottom_line: false,
    isShowCommentBtn:false,
    totalCount: totalCount,
  },
  onLoad: function(options) {
    //设置第一次数据
    common.userIsLogin();
    wx.startPullDownRefresh;
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getMsgList(that, isConcat);
    common.isShow(that);
  },
  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {
    var that = this;
    common.userIsLogin();
    common.isShow(that);
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
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getMsgList(that, isConcat);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    pageNo = pageNo + 1;
    var isConcat = true;
    getMsgList(that, isConcat);
  },
  //祝福
  comment: function() {
    var that = this;
    common.userIsLogin();
    var openId= app.globalData.openId;
    if (openId == null || openId == undefined) {
      return;
    }
    var userInfo = app.globalData.userInfo;
    var user = JSON.parse(userInfo);
    var name = user.nickName;
    var face = user.avatarUrl;
    var words = that.data.inputValue;
    if (words == null || words == undefined) {
      wx.showModal({
        title: '提示',
        content: '您还没有祝福',
        showCancel: false
      })
      return false;
    }
    wx.request({
      url: serverUrl + '/msg/save',
      method: 'POST',
      data: {
        "sourceCode": "wechat",
        'nickName': name,
        'photoUrl': face,
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
        wx.showToast({
          title: message,
          icon: 'success',
          duration: 2000
        })
        if (code != 200) {
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
      "sourceCode": "wechat",
      "pageNo": pageNo,
      "pageSize": pageSize,
      "type": type
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      totalCount = res.data.data.totalCount;
      if(totalCount==null||totalCount==undefined){
        totalCount=0;
      }
      that.setData({
        bottom_msg: "没有更多祝福了,你也祝福吧...",
        bottom_line: true,
        totalCount: totalCount,
      });
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      if (isConcat && pageNo > 1) {
        list = that.data.commentList.concat(res.data.data.list);
        that.setData({
          bottom_line: false,
          bottom_msg: "加载更多"
        });
      }
      that.setData({
        commentList: list
      });
    }
  })
}