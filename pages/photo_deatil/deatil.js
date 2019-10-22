var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo=1;
var pageSize = 10;
var bizId=null;
var totalCount=0;
Page({
    onLoad: function(options) {
      bizId = options.id;//123
      var url = options.url;
      var name = options.name;
      pageNo = 1;
      console.log(bizId + "-----------------" + url);
      common.userIsLogin();
      wx.startPullDownRefresh;
      var that = this;
      that.setData({
        totalCount: totalCount,
        photoCommentList: [],
        bottom_line: false,
        bg_img_url: url,
        bg_img_name: name
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
    var that = this;
    pageNo =1;
    var isConcat = false;
    getPhotoCommentList(that, isConcat);
  },
  
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
        'bizId': bizId,
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
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type, "bizId": bizId},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code;
      var message = res.data.message;
      totalCount = res.data.data.totalCount;
      if (totalCount == null || totalCount == undefined) {
        totalCount = 0;
      }
      that.setData({
        totalCount: totalCount,
        bottom_msg: "没有更多评论了,你说几句呗...",
        bottom_line: true,
      });
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      if (isConcat)
      {
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