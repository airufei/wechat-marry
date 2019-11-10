var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
var pageNo = 1;
var pageSize = common.pageSize();
var musicList = null;
var musicUrl = null;
var musicTitle = null;
var timer = null; // 计时器
var isOpenDomm = true;
Page({
  data: {
    isPlayingMusic: true,
    bottom_line: false,
    music_url: true,
  },
  onLoad: function(options) {
    wx.startPullDownRefresh;
    var that = this;
    that.setData({
      photoList: [],
      allCommentList: [],
      isOpenDomm: isOpenDomm,
    });
    wx.showShareMenu({
      withShareTicket: true
    })
    var isConcat = false;
    getPhotoList(that, isConcat);
    getBannerList(that);
    musicPlay('first');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    isOpenDomm = true;
    getSetTimeoutCommentList(that); //弹幕
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
    var target = ops.target;
    if (target == null) {
      return;
    }
    var id = target.dataset.id; //123
    var url = target.dataset.url;
    var name = target.dataset.name;
    if (name == null || name.length <= 0 || name == undefined) {
      name = "飞叔的婚礼小程序";
    }
    return {
      title: name,
      path: '/pages/photo_deatil/deatil?id=' + id + '&url=' + url, // 路径，传递参数到指定页面。
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //写在onHide()中，切换页面或者切换底部菜单栏时关闭定时器。
    clearInterval(timer);
    isOpenDomm = false;
  },
  //长按切换歌曲
  handleLongPress: function(e) {
    var that = this;
    musicPlay('change');
  },
  stopOrSatrt: function() {
    var that = this;
    var message = "";
    if (isOpenDomm) {
      isOpenDomm = false;
      message = "已关闭弹幕";
    } else {
      isOpenDomm = true;
      message = "已开启弹幕";
      getSetTimeoutCommentList(that); //彈幕
    }
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
    console.log("开启关闭弹幕=" + isOpenDomm);
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
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../photo_deatil/deatil?id=' + id + '&url=' + url,
    })
  },
  btnLike: function(e) {
    var that = this;
    common.userIsLogin();
    var bizId = e.target.dataset.id; //123
    var likecount = e.target.dataset.likecount; //123
    var openId = app.globalData.openId;
    if (openId == null) {
      return;
    }
    var index = e.target.dataset.index;
    var key = openId + bizId;
    var btnLike = 'photoList[' + index + '].likeCount';
    var cache = getCache(key);
    if (cache != null && cache != undefined && cache.length > 0) {
      wx.showToast({
        title: "已赞过,谢谢",
        icon: 'success',
        duration: 2000
      })
    } else {
      saveCache(key, 'has_kile');
      commitLike(that, bizId);
      this.setData({
        [btnLike]: likecount + 1
      });
    }
  },
});

//点赞功能
var commitLike = function(that, bizId) {
  var userInfo = app.globalData.userInfo;
  var user = JSON.parse(userInfo);
  var name = user.nickName;
  var face = user.avatarUrl;
  wx.request({
    url: serverUrl + '/like/save',
    method: 'POST',
    data: {
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
      var message = res.data.message
      if (code != 200) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        })
        return false;
      }
      wx.showToast({
        title: "谢谢点赞",
        icon: 'success',
        duration: 2000
      })
    }
  });
}

//获取banner图
var getBannerList = function(that) {
  var type = "banner_photo";
  type = "ptoto_test";
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
  newMusicPlayer(musicUrl, musicTitle);
}
//音乐播放器
var newMusicPlayer = function(musicUrl, musicTitle) {
  const backgroundAudioManager = wx.getBackgroundAudioManager();
  backgroundAudioManager.title = musicTitle
  backgroundAudioManager.coverImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572083110925&di=ce6846d1499b8b77d8167458b4f47e2e&imgtype=0&src=http%3A%2F%2Fimg1.gtimg.com%2Ftech%2Fpics%2Fhv1%2F14%2F8%2F2055%2F133628429.jpg'
  // 设置了 src 之后会自动播放
  backgroundAudioManager.src = musicUrl;
  backgroundAudioManager.play();
  backgroundAudioManager.onPlay(() => {
    console.log("音乐播放开始");
  })
  backgroundAudioManager.onEnded(() => {
    console.log("音乐播放结束");
    musicPlay('change');
    console.log("随机下一首");
  });
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
      console.log("----关闭弹幕3----" + musicList);
    }
  });
}

//获取相册列表  "https://rufei.cn/pic/music/e4ed02883b904d228b571cdffa4a6781.mp3"
var getPhotoList = function(that, isConcat) {
  var type = "common_photo";
  type = "ptoto_test";
  that.setData({
    bottom_msg: "加载中..."
  });
  if (pageNo > 1) {
    common.userIsLogin();
    pageNo = 1;
  }
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
      if (isConcat&&pageNo>1) {
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

var doomPageNo = 1;
//定时刷新弹幕
var getSetTimeoutCommentList = function(that) {
  timer = setInterval(function() {
    getAllCommentList(that);
  }, 10000)
}

//获取照片评论
var getAllCommentList = function(that) {
  if (!isOpenDomm) {
    console.log("----关闭弹幕3----");
    return;
  }
  console.log("----刷弹幕----" + doomPageNo);
  wx.request({
    url: serverUrl + '/msg/getList',
    method: 'POST',
    data: {
      "pageNo": doomPageNo,
      "pageSize": 10,
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
      if (!open) {
        isOpenDomm = open;
      }
      if (code != 200) {
        doomPageNo = 1;
        return false;
      }
      doomPageNo = doomPageNo + 1;
      var list = res.data.data.list;
      that.setData({
        allCommentList: list,
        isOpenDomm: open,
        allCommentList: list
      });
    }
  })
}

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