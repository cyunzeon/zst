var hosts = 'http://m.178ty.com';
function GetQueryString (name) { //获取指定name的url参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]);
	return null;
}