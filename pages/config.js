var xmf_server_url_pro='https://rufei.cn';
var xmf_server_url_dev = 'http://localhost:8082';
function getserverUrl()
{
  return xmf_server_url_pro +"/wechat/";
};
function getAppid() {
  return "wxf25e90199003dbdb";
};
function getSecret() {
  return "b32dc988ea15473d30234708ec801772";
};
module.exports.getserverUrl = getserverUrl; 
module.exports.getAppid = getAppid; 
module.exports.getSecret = getSecret;

