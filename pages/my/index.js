var common = require("../config.js");
var userUtil = require("../userUtil.js");
var serverUrl = common.getserverUrl();
var app = getApp();
Page( {
  onLoad: function() {
    userUtil.userIsLogin();
  }
});
