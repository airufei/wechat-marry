var app = getApp();
var common = require("../config.js");
var userUtil = require("../userUtil.js");
var serverUrl = common.getserverUrl();
var pageNo=1;
var pageSize = 10;
var picId=null;
Page({
    onLoad: function(options) {
      picId = options.id;//123
      var url = options.url;
      pageNo = 1;
      console.log(picId + "-----------------" + url);
      userUtil.userIsLogin();
      wx.startPullDownRefresh;
      var that = this;
      that.setData({
        photoCommentList: [],
        bg_img_url: url
      })
      var isConcat = false;
      getPhotoCommentList(that, isConcat);
    },
    bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    console.log("监听用户下拉动作");
    var that = this;
    pageNo =1;
    var isConcat = false;
    getPhotoCommentList(that, isConcat);
  },
  
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("监听用户上拉拉动作");
    var that = this;
    pageNo = pageNo+1;
    var isConcat = true;
    getPhotoCommentList(that, isConcat);
  },
  //提交评论
  photoComment: function () {
    var that = this;
    //留言内容不是空值
    var userInfo = app.globalData.userInfo;
    if (userInfo == null || userInfo == undefined) {
      wx.showModal({
        title: '提示',
        content: '未登录',
        showCancel: false
      })
    }
    var name = userInfo.nickName;
    var face = userInfo.avatarUrl;
    var words = that.data.inputValue;
    if (words == null || words == undefined) {
      wx.showModal({
        title: '提示',
        content: '您还没有填写内容',
        showCancel: false
      })
    }
    wx.request({
      url: serverUrl + '/msg/save',
      method: 'POST',
      data: {
        'bizId': picId,
        'nickname': name,
        'photourl': face,
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
        var isConcat=false;
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
var getPhotoCommentList = function (that,isConcat) {
  var type = "photo_comment"
  that.setData({
    bottom_msg: "加载中..."
  });
  wx.request({
    url: serverUrl + '/msg/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type, "bizId": picId},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code
      var message = res.data.message
      if (code != 200) {
        that.setData({
          bottom_msg: "没有评论了,你说几句呗..."
        });
        return false;
      }
      var list = res.data.data.list;
      if (isConcat)
      {
        list = that.data.photoCommentList.concat(res.data.data.list);
      }
      that.setData({
        photoCommentList: list,
        bottom_msg:"加载更多"
      });
    }
  })
}