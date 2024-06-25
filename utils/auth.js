const TokenKey = "token-key";

/**
 * 获取 Token
 * @return {String} token
 */
export function getToken() {
	return uni.getStorageSync(TokenKey);
}

/**
 * 设置 Token
 * @param {String} token token字符串
 */
export function setToken(token) {
	uni.setStorageSync(TokenKey, token);
}

/**
 * 移除 Token
 */
export function removeToken() {
	uni.removeStorageSync(TokenKey);
}