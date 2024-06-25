/**
 * 消息提示框(封装)
 * @param {String} message 消息内容
 */
const toast = (message) => {
	uni.showToast({
		title: message,
		icon: 'none'
	});
}

export default {
	toast
}