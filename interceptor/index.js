import { getToken } from "@/utils/auth";
import useUserStore from "@/stores/modules/user";

const whiteList = [
	'/pages/login/login',
	'/pages/index/index',
	'/pages/mine/mine',
	'/'
];

const list = [
	'navigateTo',
	'redirectTo',
	'reLaunch',
	'switchTab'
];

/**
 * 校验是否拉取用户信息
 * @description 判断用户是否已拉取完user_info信息
 */
const checkUserInfo = async (url) => {
	if (!useUserStore().name) {
		try {
			await useUserStore().getInfo();
		} catch (error) {
			await useUserStore().logout();
			uni.showToast({
				icon: 'none',
				title: error.message
			});
			return false;
		}
	}
	return true;
}

/**
 * 校验
 * @param {String} url 路径
 * @description 校验白名单和token
 */
const hasPermission = (url) => {
	// 判断是否有token
	if (getToken()) {
		// 已登录的情况下，访问登录页面，跳转到首页
		if (url === '/pages/login/login') {
			next();
			return false;
		} else {
			// 判断用户是否已拉取完user_info信息
			checkUserInfo();
		}
	} else {
		// 判断白名单
		// 判断免登录白名单,true 直接进入, false 进入登录页面
		if (whiteList.indexOf(url) !== -1) {
			return true;
		} else {
			next('/login');
			return false;
		}
	}
	return true;
}

const next = (url = '/index') => {
	uni.reLaunch({
		url: `/pages${url}${url}`
	});
}

/**
 * 路由守卫
 */
export const routerInterceptor = () => {
	
	// H5 地址栏输入拦截
	// #ifdef H5
	const url = window.location.hash.split('#')[1];
	console.log(url);
	hasPermission(url);
	// #endif
	
	// 添加拦截器
	list.forEach((item) => {
		uni.addInterceptor(item, {
			async invoke(args) {
				console.log(item, args);
				return hasPermission(args.url) ? args : false;
			}
		});
	});
}