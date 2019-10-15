var common = require("../config.js");
var serverUrl = common.getserverUrl();
var app = getApp()
Page({
    data: {
    },
    onLoad: function(options) {
        var that = this
        wx.request({
            url: serverUrl+'/api/getTvList',
            method: 'GET',
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