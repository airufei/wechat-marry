var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo = 1;
var pageSize = 10;
var musicList = null;
var musicUrl = null;
var musicTitle = null;
Page({
  data: {
    isPlayingMusic: true,
    bottom_line: false,
    music_url: true,
  },
  onLoad: function(options) {
    common.userIsLogin();
    wx.startPullDownRefresh;
    var that = this;
    that.setData({
      photoList: [],
    })
    var isConcat = false;
    getPhotoList(that, isConcat);
    getBannerList(that);
    musicPlay('first');
  },
  //长按切换歌曲
  handleLongPress: function(e) {
    var that = this;
    musicPlay('change');
  },
  //音乐暂停、启动
  play: function(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      musicPlay('start');
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    pageNo = 1;
    var isConcat = false;
    getPhotoList(that, isConcat);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    pageNo = pageNo + 1;
    var isConcat = true;
    getPhotoList(that, isConcat);
  },
  //跳转详情
  toDetailView: function(e) {
    var id = e.currentTarget.dataset.id; //123
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../photo_deatil/deatil?id=' + id + '&url=' + url + '&name=' + url,
    })
  },
  btnLike: function(e) {
    var that = this;
    var bizId = e.currentTarget.dataset.id; //123
    var openId = app.globalData.openId;
    var key = openId + bizId;
    var cache = getCache(key);
    if (cache != null && cache != undefined && cache.length>0) {
      wx.showModal({
        title: '温馨提示',
        content: "这张已赞过，你可以点赞下一张，谢谢.",
        showCancel: false
      })
    } else {
      saveCache(key,'has_kile');
      commitLike(that, bizId);
    }
  },
});

//点赞功能
var commitLike = function(that, bizId) {
  var likeCount = 1;
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
  wx.request({
    url: serverUrl + '/like/save',
    method: 'POST',
    data: {
      'bizId': bizId,
      'likeCount': likeCount,
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
      var message = res.data.message
      if (code != 200) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        })
        return false;
      } else {
        wx.showModal({
          title: '温馨提示',
          content: "谢谢点赞",
          showCancel: false
        })
      }
    }
  });
}

//获取banner图
var getBannerList = function(that) {
  var type = "banner_photo"
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: {
      "pageNo": pageNo,
      "pageSize": 10,
      "type": type
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      var code = res.data.code
      var message = res.data.message
      if (code != 200) {
        return false;
      }
      that.setData({
        bannerList: res.data.data.list
      });
    }
  })
}

//播放音乐
var musicPlay = function(type) {
  //设置第一次数据
  if (musicList == null || musicList == undefined) {
    getMusicList();
    setTimeout(function() {
      musicPlay(type);
    }, 1000) //延迟时间 这里是1秒
  }
  if (musicList == null || musicList == undefined) {
    return;
  }
  var index = Math.floor(Math.random() * musicList.length);
  if ((musicUrl == null || musicUrl == undefined) || type == 'change') {
    musicTitle = musicList[index].title;
    musicUrl = musicList[index].url;
  }
  if (musicUrl == null || musicUrl == undefined) {
    console.log(type + "播放器 没有播放连接=" + musicUrl);
  }
  wx.playBackgroundAudio({
    dataUrl: musicUrl,
    title: musicTitle,
    coverImgUrl: ''
  })
}

//获取音乐列表
var getMusicList = function() {
  var type = "";
  wx.request({
    url: serverUrl + '/music/getList',
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
      var code = res.data.code;
      if (code != 200) {
        return false;
      }
      musicList = res.data.data.list;
    }
  });
}
//获取相册列表
var getPhotoList = function(that, isConcat) {
  var type = "common_photo"
  that.setData({
    bottom_msg: "加载中..."
  });
  wx.request({
    url: serverUrl + '/photo/getList',
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
      var code = res.data.code;
      var message = res.data.message;
      that.setData({
        bottom_line: true,
        bottom_msg: "没有更多照片了"
      });
      if (code != 200) {
        return false;
      }
      var list = res.data.data.list;
      if (isConcat) {
        list = that.data.photoList.concat(res.data.data.list);
        that.setData({
          bottom_line: false,
          bottom_msg: "加载更多"
        });
      }
      that.setData({
        photoList: list
      });
    }
  })
};

//存储本地缓存
var saveCache = function(key, value) {
  try {
    var key = "cache_type_" + key;
    wx.setStorageSync(key, value);
  } catch (e) {
    console.log("saveCache---------------------" + e)
  }
};
//获取本地缓存
var getCache = function(key) {
  var key = "cache_type_" + key;
  var cacheValue = null;
  try {
    cacheValue = wx.getStorageSync(key.toString());
  } catch (e) {
    console.log("getCache---------------------" + e)
  }
  return cacheValue;
};