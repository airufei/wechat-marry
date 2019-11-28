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
      isShowCommentBtn: false,
      open: true,
    })
    var isConcat = false;
    getPhotoById(that, bizId);
    common.isShow(that);
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    common.isShow(that);
  },
  /**
   * 用户点击右上角分享（index.js）
   */
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    common.userIsLogin();
    var openId = app.globalData.openId;
    if (openId == null || openId == undefined) {
      return false;
    }
    var target = ops.target;
    if (target == null) {
      return false;
    }
    var id = target.dataset.id; //123
    var url = target.dataset.url;
    var name = target.dataset.name;
    if (name == null || name.length <= 0 || name == undefined) {
      name = "如飞泽丽的婚纱相册";
    }
    return {
      title: name,
      path: '/pages/photo_deatil/deatil?id=' + id, // 路径，传递参数到指定页面。
      imageUrl: url, // 分享的封面图
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '感谢分享',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
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
  //dianping
  photoComment: function() {
    var that = this;
    common.userIsLogin();
    var openId = app.globalData.openId;
    if (openId == null || openId == undefined) {
      return false;
    }
    var userInfo = app.globalData.userInfo;
    var user = JSON.parse(userInfo);
    var name = user.nickName;
    var face = user.avatarUrl;
    var words = that.data.inputValue;
    if (words == null || words == undefined) {
      wx.showToast({
        title: "没有祝福",
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: serverUrl + '/msg/save',
      method: 'POST',
      data: {
        "sourceCode": "wechat",
        'bizId': bizId,
        'nickName': name,
        'photoUrl': face,
        'content': words,
        'type': 'photo_comment',
        'openId': openId
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
        getPhotoCommentList(that, isConcat);
      }
    })
    that.setData({
      inputValue: '' //将data的inputValue清空
    });
    return;
  },
  btnLike: function(e) {
    var that = this;
    common.userIsLogin();
     bizId = e.target.dataset.id; //123
    var openId = app.globalData.openId;
    if (openId == null) {
      return;
    }
    commitLike(that, bizId);
  },
});

//点赞功能
var commitLike = function (that, bizId) {
  var userInfo = app.globalData.userInfo;
  var user = JSON.parse(userInfo);
  var name = user.nickName;
  var face = user.avatarUrl;
  var openId = app.globalData.openId;
  if (openId == null || openId == undefined) {
    return;
  }
  wx.request({
    url: serverUrl + '/like/save',
    method: 'POST',
    data: {
      "sourceCode": "wechat",
      'bizId': bizId,
      'likeCount': 1,
      'nickName': name,
      'photoUrl': face,
      'type': 'photo_like',
      'openId': app.globalData.openId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: res => {
      var code = res.data.code
      var message = res.data.message;
      var likecount = res.data.data;
      if (code != 200) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        })
        return false;
      }
      that.setData({
        likeCount: likecount
      });
      wx.showToast({
        title: "谢谢点赞",
        icon: 'success',
        duration: 2000
      })
    }
  })
}

//获取照片zhufu
var getPhotoCommentList = function(that, isConcat) {
  var type = "photo_comment"
  that.setData({
    bottom_msg: "加载中..."
  });
  if (pageNo > 1) {
    common.userIsLogin();
    pageNo = 1;
  }
  wx.request({
    url: serverUrl + '/msg/getList',
    method: 'POST',
    data: {
      "sourceCode": "wechat",
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
        bottom_msg: "没有更多祝福了,你也祝福吧...",
        bottom_line: true,
        open: open,
      });
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      if (isConcat && pageNo > 1) {
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
var getPhotoById = function(that, bizId) {
  wx.request({
    url: serverUrl + '/photo/getWxPhoto',
    method: 'POST',
    data: {
      "sourceCode": "wechat",
      'id': bizId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code;
      var message = res.data.message;
      if (code != 200) {
        return false;
      }
      if (res.data.data == null || res.data.data==undefined)
      {
        return false;
      }
      var name = res.data.data.name;
      var url = res.data.data.url;
      var likeCount = res.data.data.likeCount;
      var id = res.data.data.id;
      bizId = id;
      that.setData({
        name: name,
        url: url,
        id: id,
        likeCount: likeCount
      });
    }
  })
};