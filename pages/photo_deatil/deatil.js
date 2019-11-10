var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo = 1;
var pageSize = common.pageSize();
var bizId = null;
var totalCount = 0;
Page({
  onLoad: function(options) {
    bizId = options.id; //123
    var url = options.url;
    pageNo = 1;
    console.log("photoId-----------------" + bizId);
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.startPullDownRefresh;
    var that = this;
    that.setData({
      totalCount: totalCount,
      photoCommentList: [],
      bottom_line: false,
      open: true,
      bg_img_url: url,
    })
    var isConcat = false;
    getPhotoCommentList(that, isConcat);
  },
  bindKeyInput: function(e) {
    var value = e.detail.value;
    this.setData({
      inputValue: value
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getPhotoCommentList(that, isConcat);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    pageNo = pageNo + 1;
    var isConcat = true;
    getPhotoCommentList(that, isConcat);
  },
  //提交评论
  photoComment: function() {
    var that = this;
    common.userIsLogin();
    //留言内容不是空值
    var userInfo = app.globalData.userInfo;
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
        'bizId': bizId,
        'nickName': name,
        'photoUrl': face,
        'content': words,
        'type': 'photo_comment',
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
        getPhotoCommentList(that, isConcat);
      }
    })
    that.setData({
      inputValue: '' //将data的inputValue清空
    });
    return;
  }
});

//获取照片评论
var getPhotoCommentList = function(that, isConcat) {
  var type = "photo_comment"
  that.setData({
    bottom_msg: "加载中..."
  });
  if(pageNo>1){
     common.userIsLogin();
    pageNo=1;
  }
  wx.request({
    url: serverUrl + '/msg/getList',
    method: 'POST',
    data: {
      "pageNo": pageNo,
      "pageSize": pageSize,
      "type": type,
      "bizId": bizId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      totalCount = res.data.data.totalCount;
      var open = res.data.data.open;
      if (totalCount == null || totalCount == undefined) {
        totalCount = 0;
      }
      if (open == undefined || open == null) {
        open = false;
      }
      that.setData({
        totalCount: totalCount,
        bottom_msg: "没有更多评论了,你说几句呗...",
        bottom_line: true,
        open: open,
      });
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      if (isConcat) {
        list = that.data.photoCommentList.concat(res.data.data.list);
        that.setData({
          bottom_msg: "加载更多",
          bottom_line: false,
        });
      }
      that.setData({
        photoCommentList: list
      });
    }
  })
}

//大于当前Id的相册
var getPhotoGroupList = function(that) {
  var type = "common_photo";
  type = "ptoto_test";
  that.setData({
    bottom_msg: "加载中..."
  });
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: {
      "pageNo": pageNo,
      "pageSize": pageSize,
      "type": type,
      'id': bizId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      var open = res.data.data.open;
      if (open == undefined || open == null) {
        open = false;
      }
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      that.setData({
        photoGroupList: list,
        open: open,
        photoGroupList: list
      });
    }
  })
};