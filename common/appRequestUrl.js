const baseUrl = "http:////微信：egvh56ufy7hh,QQ：821898835";

const urlMap = {
	login: baseUrl + "/login",
	logout: baseUrl + "/logout",
	loginCheck: baseUrl +"/getUserInfo",//获取微信账号信息

	findPhArticleList: baseUrl+ "/phArticle/queryList",
	findPhArticle: baseUrl+ "/phArticle/queryObject",
	addPhArticle: baseUrl+ "/phArticle/addPhArticle",
	editPhArticle: baseUrl+ "/phArticle/editPhArticle",

	findPhCommentList: baseUrl+ "/phComment/queryList",
	findPhComment: baseUrl+ "/phComment/queryObject",
	addPhComment: baseUrl+ "/phComment/addPhComment",
	editPhComment: baseUrl+ "/phComment/editPhComment",

	findPhOrderList: baseUrl+ "/phOrder/queryList",
	findPhOrder: baseUrl+ "/phOrder/queryObject",
	addPhOrder: baseUrl+ "/phOrder/addPhOrder",
	editPhOrder: baseUrl+ "/phOrder/editPhOrder",

	findPhClothPlaceList: baseUrl+ "/phClothPlace/queryList",
	findPhClothPlace: baseUrl+ "/phClothPlace/queryObject",
	addPhClothPlace: baseUrl+ "/phClothPlace/addPhClothPlace",
	editPhClothPlace: baseUrl+ "/phClothPlace/editPhClothPlace",

	findPhPicList: baseUrl+ "/phPic/queryList",
	findPhPic: baseUrl+ "/phPic/queryObject",
	addPhPic: baseUrl+ "/phPic/addPhPic",
	editPhPic: baseUrl+ "/phPic/editPhPic",

	findPhOrderItemList: baseUrl+ "/phOrderItem/queryList",
	findPhOrderItem: baseUrl+ "/phOrderItem/queryObject",
	addPhOrderItem: baseUrl+ "/phOrderItem/addPhOrderItem",
	editPhOrderItem: baseUrl+ "/phOrderItem/editPhOrderItem",

	findQuUserList: baseUrl+ "/quUser/queryList",
	findQuUser: baseUrl+ "/quUser/queryObject",
	addQuUser: baseUrl+ "/quUser/addQuUser",
	editQuUser: baseUrl+ "/quUser/editQuUser",

	getPicById : baseUrl + "/phPic/getPicById/"
}

const getUserInfo = function(){
	var _this = this;
	try {
		const value = uni.getStorageSync('userInfo');
		console.log("1"+JSON.stringify(value));
		return value ? value : false;
	} catch (e) {
		return false;
	}
}

const login = function(){
	var _this = this;
}

const request = function(requestOpt) {
	try {
		requestOpt = requestOpt || {};
		if (!requestOpt.url) {
			requestFail();
			return;
		}
		var token = "";
		try {
			const value = uni.getStorageSync('userInfo');
			if (value) {
				token = value.token;
			}
		} catch (e) {
			token = "";
		}
		requestOpt.data = requestOpt.data || {};
		requestOpt.data['token'] = token;
		requestOpt.method = requestOpt.method || 'POST';
		requestOpt.header = requestOpt.header || {
			// 'content-type': 'application/x-www-form-urlencoded',
			'token': token
		};
		requestOpt.timeout = requestOpt.timeout || 30000;
		requestOpt.responseType = requestOpt.responseType || 'text';
		requestOpt.dataType = requestOpt.dataType || "json";
		requestOpt.sslVerify = requestOpt.sslVerify || true;
		requestOpt.success = requestOpt.success || function(res) {};
		requestOpt.fail = requestOpt.fail || function(res) {};
		requestOpt.complete = requestOpt.complete || function(res) {};
		uni.showLoading({
			title: "加载中"
		});

		uni.request({
			url: requestOpt.url,
			data: requestOpt.data,
			method: requestOpt.method,
			responseType: requestOpt.responseType,
			sslVerify: requestOpt.sslVerify,
			timeout: requestOpt.timeout,
			dataType: requestOpt.dataType,
			header: requestOpt.header,
			success: function(res) {
				requestOpt.success(res);
				if(res.data.code == 401){
					uni.showToast({
						title:"未登录",
						icon:'none'
					})
					uni.removeStorageSync('user');
				}
			},
			fail: function(res) {
				requestOpt.fail(res);
			},
			complete: function(res) {
				uni.hideLoading();
			}
		});
	} catch (e) {
		//TODO handle the exception
		uni.hideLoading();
		uni.showToast({
			icon: "none",
			title: "请求异常"
		})
	}
}


export default {
	getUserInfo,
	baseUrl,
	request,
	urlMap,
	login
}
