var accounts = require('./config').accounts;
var urlInfo = require('./config').urlInfo;
var requestModule = require('superagent');
var cheerio = require('cheerio');
var headers=set_header();
switch(process.argv[2]){
	case 'login':
		var actflg='login';
		break;
	case 'leave':
	default:
		var actflg='leave';
}
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
				request_sign_pageInfo(cookie_set);
			}else{
				console.log('登入失敗');
			}
        }
    });
}
// 登入之後動作 // 抓取簽到頁面資訊 // 執行簽到 // 簽退
function request_sign_pageInfo(cookie_set){
	var url=urlInfo.index + '/' + urlInfo.sign;
	requestModule.get(url).set(headers).set('Cookie', cookie_set).redirects(0).end(function (error, result) {
        if (error) {
            var info = '抓取簽到頁面資訊 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
			var $ = cheerio.load(result.text);
			var acturl='';
			var srh_string='/'+urlInfo.sign+'?act='+actflg;
			$('table.text11 tr#MainMenu td a').each(function(i, elem){
				if('#'==$(this).attr("href") || $(this).attr("href").indexOf(srh_string)==-1){return;}
				// console.log($(this).attr("href"));
				acturl=$(this).attr("href");
				return false;
			});
			if(0<acturl.length){
				// console.log('抓取資料成功');
				request_login_ctl(cookie_set,acturl);				
			}else{
				console.log('抓取資料失敗');
			}
        }
    });
}
// 控制簽到簽退  連到 抓回來 通過資訊的連結
function request_login_ctl(cookie_set,acturl) {
	var post_set=set_loginPostInfo();
	var url=urlInfo.index + acturl;
    requestModule.get(url).set(headers).set('Cookie', cookie_set).redirects(0).end(function (error, result) {
        if (error) {
            var info = actflg + 'act 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
			var retstatus=result.status;
			// console.log(retstatus);
			if(200==retstatus){
				console.log(actflg + 'act 成功');
			}else{
				console.log(actflg + 'act 失敗');
			}
        }
    });
}
// 模擬 簽退
function request_leave(cookie_set) {
	var post_set=set_loginPostInfo();
	var url=urlInfo.index + '/' + urlInfo.sign + '?act=leave&id=1938';
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
// 模擬 簽到
function request_login(cookie_set) {
	var post_set=set_loginPostInfo();
	var url=urlInfo.index + '/' + urlInfo.sign + '?act=login';
    requestModule.get(url).set(headers).set('Cookie', cookie_set).redirects(0).end(function (error, result) {
        if (error) {
            var info = '模擬 簽到 出错啦,可能网络有问题.' + error;
            console.log(info);
        } else {
			var retstatus=result.status;
			// console.log(retstatus);
			if(200==retstatus){
				console.log('簽到成功');
			}else{
				console.log('簽到失敗');
			}
        }
    });
}
request_Index();
console.log('日志日期为: ' + new Date());