var app = getApp();
var common = require("../config.js");
var userUtil = require("../userUtil.js");
var serverUrl = common.getserverUrl();
var pageNo=1;
var pageSize = 10;
var musicList=null;
var musicUrl = null;
var musicTitle = null;
Page({
    data: {
      isPlayingMusic: true,
      bottom_line:false,
      music_url: true,
    },
    onLoad: function(options) {
      userUtil.userIsLogin();
      wx.startPullDownRefresh;
      var that = this;
      that.setData({
        photoList: [],
      })
      var isConcat = false;
      getPhotoList(that, isConcat);
      getBannerList(that);
      musicPlay(that);
    },
 //长按切换歌曲
  handleLongPress: function (e) {
    var that = this;
    musicPlay(that);
  },
    //音乐暂停、启动
  play: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      musicPlay(this);
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
    var isConcat = false;
    getPhotoList(that, isConcat);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("监听用户上拉拉动作");
    var that = this;
    pageNo = pageNo+1;
    var isConcat = true;
    getPhotoList(that, isConcat);
  },
  //跳转详情
  toDetailView: function (e) {
    var id = e.currentTarget.dataset.id;//123
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../photo_deatil/deatil?id=' + id + '&url=' + url + '&name=' + url,
    })
  },
});

//获取banner图
var getBannerList = function (that) {
  var type="banner_photo"
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": 10, "type": type},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code=res.data.code
      var message = res.data.message
      if (code!=200)
      {
         return false;
      }
      that.setData({
        bannerList: res.data.data.list
      });
    }
  })
}

//播放音乐
var musicPlay = function (that) {
  //设置第一次数据
  if(musicList==null||musicList==undefined){
    getMusicList();
    setTimeout(function () {
      musicPlay();
    }, 1000) //延迟时间 这里是1秒
  }
  if (musicList == null || musicList == undefined) {
    return;
  }
  var index = Math.floor(Math.random() * musicList.length);
  if (musicUrl == null || musicUrl==undefined){
    musicTitle = musicList[index].title;
    musicUrl = musicList[index].url;
  }
  wx.playBackgroundAudio({
    dataUrl: musicUrl,
    title: musicTitle,
    coverImgUrl: ''
  })
}
//获取音乐列表
var getMusicList = function () {
  var type = "";
  wx.request({
    url: serverUrl + '/music/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code;
      if (code != 200) {
        return false;
      }
      musicList = res.data.data.list;
    }
  });
}
//获取相册列表
var getPhotoList = function (that, isConcat) {
  var type = "common_photo"
  that.setData({
    bottom_msg: "加载中..."
  });
  wx.request({
    url: serverUrl + '/photo/getList',
    method: 'POST',
    data: { "pageNo": pageNo, "pageSize": pageSize, "type": type },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var code = res.data.code;
      var message = res.data.message;
      that.setData({
        bottom_line:true,
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
}