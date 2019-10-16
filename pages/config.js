var xmf_server_url_pro='https://rufei.cn';
var xmf_server_url_dev = 'http://localhost:8082';
function getserverUrl()
{
  return xmf_server_url_pro +"/wechat/";
};
function getAppid() {
  return "wx59af00d8e29c7f77";
};
function getSecret() {
  return "9fdd330b54422887e8ef031d662413f8";
};
module.exports.getserverUrl = getserverUrl; 
module.exports.getAppid = getAppid; 
module.exports.getSecret = getSecret;