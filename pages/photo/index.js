var app = getApp();
var common = require("../config.js");
var userUtil = require("../userUtil.js");
var serverUrl = common.getserverUrl();
var pageNo=1;
var pageSize = 10;
var miu01 = 'http://www.ytmp3.cn/down/49676.mp3';
var miu02 = 'https://rufei.cn/pic/miusic/xiangsi.mp3';
var miu03 = 'https://rufei.cn/pic/miusic/xingyueshenhua.mp3';
var miu04 = 'https://rufei.cn/pic/miusic/DarinCant Stop Love.mp3';

var musicUrl = null;
var items = [miu01, miu02, miu03, miu04];
Page({
    data: {
      autoplay: true,
      isPlayingMusic: true,
      music_url: miu04,
    },
    onLoad: function(options) {
      userUtil.userIsLogin();
      wx.startPullDownRefresh;
      var that = this;
      that.setData({
        photoList: [],
      })
      getPhotoList(that);
      getBannerList(that);
      musicPlay(miu04);
    },
    bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    },
 //长按切换歌曲
  handleLongPress: function (e) {
    var item = items[Math.floor(Math.random() * items.length)];
    while (item == musicUrl) {
      item = items[Math.floor(Math.random() * items.length)];
    }
    musicPlay(item);
    musicUrl = musicUrl;
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
        return false;
      }
      that.setData({
        bannerList: res.data.data.list
      });
    }
  })
}

//播放音乐
var musicPlay = function (musicUrl) {
  //设置第一次数据
  wx.playBackgroundAudio({
    dataUrl: musicUrl,
    title: '',
    coverImgUrl: ''
  })
}
//获取相册列表
var getPhotoList = function (that) {
  var type = "banner_photo"
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
      var code = res.data.code
      var message = res.data.message
      if (code != 200) {
        that.setData({
          bottom_msg: "----没有了----"
        });
        return false;
      }
      that.setData({
        photoList: res.data.data.list,
        bottom_msg:"加载更多"
      });
    }
  })
}