var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo=1;
var pageSize = 10;
var musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
Page({
    data: {
      autoplay: true,
      isPlayingMusic: true,
      music_url: musicUrl
    },
    onLoad: function(options) {
      wx.startPullDownRefresh;
      var that = this;
      that.setData({
        photoList: [],
      })
      getPhotoList(that);
      getBannerList(that);
      //设置第一次数据
      wx.playBackgroundAudio({
        dataUrl: musicUrl,
        title: '',
        coverImgUrl: ''
      })

    },
    bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    },

    //音乐暂停、启动
  play: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      console.log('this.data.music_url', this.data.music_url)
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url,
        title: '',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    console.log("监听用户下拉动作");
    var that = this;
    pageNo =1;
    that.setData({
      photoList: [],
    })
    getPhotoList(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("监听用户上拉拉动作");
    var that = this;
    pageNo = pageNo+1;
    getPhotoList(that);
  },
    foo: function () {
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
      if (words==null||words==undefined)
      {
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
          'nickname': name,
          'photourl': face,
          'content': words,
          'openId': app.globalData.openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (200 == res.statusCode) {
            console.log(res.data)
            pageNo = 1;
            that.setData({
              photoList: [],
            })
            getPhotoList(that);
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          }
        }
      })
    that.setData({
      inputValue: '' //将data的inputValue清空
    });
    return;
  }
});

//获取banner图
var getBannerList = function (that) {
  var type="banner_photo"
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code=res.data.code
      var message = res.data.message
      if (code!=200)
      {
        wx.showModal({
          title: '提示',
          content: message,
          showCancel: false
        });
        return false;
      }
      that.setData({
        bannerList: res.data.data.list
      });
    }
  })
}


//获取相册列表
var getPhotoList = function (that) {
  var type = "banner_photo"
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code
      var message = res.data.message
      if (code != 200) {
        wx.showModal({
          title: '提示',
          content: message,
          showCancel: false
        });
        return false;
      }
      that.setData({
        photoList: res.data.data.list
      });
    }
  })
}