<script setup>
import { ref } from 'vue';
import { getCodeImg } from '@/api/user';
import useUserStore from '@/stores/modules/user';

const form = ref({
	username: 'admin',
	password: '123456',
	code: 'cqfb',
	uuid: ''
});

const loading = ref(false);

const codeUrl = ref('');

// 验证码开关
const captchaEnabled = ref(true);

const rules = {};

// 获取验证码图片
const getCaptchaImg = () => {
	getCodeImg().then((res) => {
		captchaEnabled.value =
			captchaEnabled.value === undefined ? true : res.captchaEnabled;
		if (captchaEnabled.value) {
			codeUrl.value = 'data:image/gif;base64,' + res.img;
			form.value.uuid = res.uuid;
		}
	});
};

const submit = async () => {
	// console.log('submit', values);
	loading.value = true;
	try {
		await useUserStore().login(form.value);
		uni.reLaunch({
			url: '/pages/index/index'
		});
	} catch (error) {
		console.log(error);
		if (captchaEnabled.value) {
			getCaptchaImg();
		}
	} finally {
		loading.value = false;
	}
};

getCaptchaImg();
</script>

<template>
	<view class="login">
		<view class="logo">
			<uv-image width="80" height="80" src="/static/logo.png" />
		</view>
		<uv-form label-width="50" label-position="left" :model="form" :rules="rules" ref="formRef">
			<uv-form-item prop="username">
				<uv-input
					:custom-style="{ width: '280px' }"
					prefix-icon="account"
					v-model="form.username"
					placeholder="用户名"
				></uv-input>
			</uv-form-item>
			<uv-form-item prop="password">
				<uv-input
					:custom-style="{ width: '280px' }"
					prefix-icon="lock"
					type="password"
					v-model="form.password"
					placeholder="密码"
				></uv-input>
			</uv-form-item>
			<uv-form-item prop="code" v-if="captchaEnabled">
				<uv-input
					:custom-style="{ width: '250px' }"
					prefix-icon="empty-permission"
					v-model="form.code"
					placeholder="验证码"
				>
					<template #suffix>
						<uv-image src="/static/images/captcha.png" width="80" height="30"></uv-image>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-button
				type="primary"
				:loading="loading"
				loading-mode="circle"
				loading-text=" "
				text="登录"
				customStyle="margin-top: 10px"
				@click="submit"
			></uv-button>
		</uv-form>
	</view>
</template>

<style lang="scss" scoped>
.login {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	// 喜欢骚点可以打开如下
	// background-image: linear-gradient(to bottom, transparent, #fff 240px),linear-gradient(to right, #005bea 20%, #00c6fb);
	.logo {
		margin-bottom: 30px;
		margin-top: 100px;
	}
}
</style>
