var app = getApp();
var common = require("../config.js");
var serverUrl = common.getserverUrl();
Page({
    data: {
        
    },
    onLoad: function(options) {
        var that = this
        wx.request({
          url: serverUrl+'getCoinList',
          method: 'POST',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    list: res.data.list
                });
            }
        })
    }

})