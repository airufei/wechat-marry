var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var common = require("../config.js");
var serverUrl = common.getserverUrl();
Page({
    data: {
    },

    onLoad: function(options) {

        var that = this
        
        // 商品详情
        wx.request({
          url: serverUrl+'getDeatilById?id=' + options.id,
          method: 'POST',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
              var articledata = res.data.data;
              WxParse.wxParse('article', 'html', articledata.content, that, 5);
              that.setData({
                shopppingDetails: articledata
              });
            }
        })

    }
})
