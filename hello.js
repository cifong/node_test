var accounts = require('./config').accounts;
var urlInfo = require('./config').urlInfo;
var requestModule = require('superagent');
var headers=set_header();
// 設定 request header
function set_header(){
	var headers = {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding': 'gzip, deflate, sdch',
		'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2,zh-CN;q=0.2',
		'Connection': 'keep-alive',
		'Host': urlInfo.Host,
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
	};
	return headers;
}
// 設定 登入  post 陣列
function set_loginPostInfo(){
	var post_set={
		'act':'login',
		'user_id':accounts.user,
		'user_pw':accounts.password,
		'chk_id':0369,
		'Submit2':'送出'
	};
	return post_set;
}
// 讀取首頁 
function request_Index() {
    var url=urlInfo.index;
    requestModule.get(url).set(headers).redirects(0).end(function (error, result) {
        if (error) {
            var info = '讀取首頁 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
            var rh = result.header['set-cookie'];
			var cookie_set = rh.toString().split('; ',1);
			if(0 == cookie_set[0].length){
				var info = '處理 cookie 值出問題!';
				console.log(info);				
			}else{
				request_Signin(cookie_set[0]);
			}
        }
    });
}
// 模擬登入
function request_Signin(cookie_set) {
	var post_set=set_loginPostInfo();
	var url=urlInfo.index;
    requestModule.post(url).set(headers).set('Cookie', cookie_set).type('form').send(post_set).end(function (error, result) {
        if (error) {
            var info = '模擬登入 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
			var rettext=result.text;
			// console.log(rettext);
			if(rettext.indexOf('main.php?ok=1')!=-1){
				request_leave(cookie_set);
			}else{
				console.log('登入失敗');
			}
        }
    });
}
// 模擬 簽退
function request_leave(cookie_set) {
	var post_set=set_loginPostInfo();
	var url=urlInfo.index + '/' + urlInfo.sign + '?act=leave&id=1902';
    requestModule.get(url).set(headers).set('Cookie', cookie_set).redirects(0).end(function (error, result) {
        if (error) {
            var info = '模擬 簽退 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
			var retstatus=result.status;
			// console.log(retstatus);
			if(200==retstatus){
				console.log('簽退成功');
			}else{
				console.log('簽退失敗');
			}
        }
    });
}
request_Index();
console.log('日志日期为: ' + new Date());