import { getToken } from '@/utils/auth';
import useUserStore from '@/stores/modules/user';

const env = {
	dev: 'https://mock.presstime.cn/mock/6694e3df463ab587e0f5274a/uni-uv-template',
	prod: ''
}

const request = (config = {}) => {
	let {
		url,
		data = {},
		method = "GET",
		header = {},
		params = ''
	} = config;

	// 参数处理 ?oldPassword=123456&newPassword=123
	if (params) {
		params = '?' + Object.keys(params)
			.map(key => `${key}=${params[key]}`)
			.join('&');
	}

	const userStore = useUserStore();

	url = env['dev'] + url + params;

	if (userStore.token) {
		header['Authorization'] = getToken();
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			success(res) {
				if (res.data.code === 200) {
					// 解出一层返回
					resolve(res.data);
				} else if (res.data.code === 401) {
					useUserStore().resetToken();
					uni.$toast(res.data.msg);
					// 登录过期
					uni.reLaunch({
						url: '/pages/login/login'
					});
					reject(res.data)
				} else {
					uni.$toast(res.data.msg);
					reject(res.data);
				}
			},
			fail(error) {
				console.log('err' + error);
				uni.$toast('网络错误，换个网络试试');
				reject(error);
			}
		});
	})
}

export default request;