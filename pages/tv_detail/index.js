var common = require("../config.js");
var serverUrl = common.getserverUrl();
var app = getApp();
 Page({
    data: {
    },
    videoErrorCallback: function (e) {
      console.log('视频错误信息:' + e.detail.errMsg);
    },
    onLoad: function(options) {

        var that = this
      
        // 商品详情
        wx.request({
            url: serverUrl+'getTvDetailById?id=' + options.id,
            method: 'POST',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
              var articledata = res.data.data;
              console.log('视频地址:' + articledata.url);
              that.setData({
                tvdata: articledata
              });
            }
        })

    }
})
