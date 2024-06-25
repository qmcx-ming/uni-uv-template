<script setup>
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import useUserStore from '@/stores/modules/user';
import { updateUserPwd } from '@/api/user';
import Avatar from '@/static/images/avatar.jpg';

const userStore = useUserStore();

const logoutModal = ref();

const editPasswordModal = ref();

const editPasswordForm = ref({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
});

const formRef = ref();

const loading = ref(false);

// 校验规则
const rules = {
	oldPassword: {
		required: true,
		message: '请输入旧密码',
		trigger: ['blur', 'change']
	},
	newPassword: {
		required: true,
		message: '请输入新密码',
		trigger: ['blur', 'change']
	},
	confirmPassword: {
		required: true,
		message: '请再次输入新密码',
		trigger: ['blur', 'change']
	}
};

// 头像预览
const showPreview = () => {
	uni.previewImage({
		urls: [Avatar]
	});
};

// 修改密码
const editPasswordConfirm = () => {
	formRef.value
		.validate()
		.then(() => {
			const passwordForm = editPasswordForm.value;
			updateUserPwd(passwordForm.oldPassword, passwordForm.newPassword).then(() => {
				uni.$toast('修改成功');
				// 关闭对话框
				editPasswordModal.value.close();
			});
		})
		.catch((error) => {})
		.finally(() => {
			// 异步关闭--关闭loading动画
			editPasswordModal.value.closeLoading();
		});
};

// 登出
const logoutHandler = async () => {
	loading.value = true;
	try {
		await userStore.logout();
		uni.reLaunch({
			url: '/pages/login/login'
		});
		uni.$toast('退出成功');
	} catch (error) {
	} finally {
		loading.value = false;
	}
};

const test = () => {
	uni.navigateTo({
		url: '/pages/login/login'
	});
};

// 判断是否是微信小程序平台
const isWeiXin = computed(() => process.env.UNI_PLATFORM === 'mp-weixin');
</script>

<template>
	<view class="mine">
		<!-- 顶部头像区 -->
		<view class="top">
			<view class="background">
				<image class="background-pic" src="/static/images/background.jpg" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<view class="avatar">
					<uv-avatar :src="userStore.avatar || Avatar" size="80" @click="showPreview"></uv-avatar>
				</view>
				<text v-if="userStore.token" class="username">{{ userStore.name }}</text>
				<navigator v-else class="username" url="/pages/login/login">立即登录</navigator>
			</view>
		</view>
		<!-- 个性签名区 -->
		<view class="personalized-signature">
			<!-- 解决微信小程序端的警告 'selectable' attribute of 
			'<text>' is deprecated. Please use 'user-select' 
			instead. -->
			<text v-if="userStore.token" :selectable="!isWeiXin" :user-select="isWeiXin" class="uv-line-2">
				{{ userStore.remark }}
			</text>
		</view>
		<!-- 底部功能区 -->
		<view class="bottom-feature">
			<uv-cell-group :custom-style="{ backgroundColor: '#ffffff', borderRadius: '8px' }" :border="false">
				<uv-cell icon="empty-permission" title="修改密码" is-link @click="editPasswordModal.open()"></uv-cell>
				<uv-cell icon="more-circle" title="个人资料" is-link url="/pages/mine/profile/profile"></uv-cell>
				<uv-cell icon="heart" title="关于我们" is-link></uv-cell>
				<uv-cell icon="setting" title="设置" is-link></uv-cell>
			</uv-cell-group>
			<view style="padding: 16px 0">
				<uv-button
					v-if="userStore.token"
					:loading="loading"
					loading-text=" "
					loading-mode="circle"
					@click="logoutModal.open()"
				>
					退出登录
				</uv-button>
				<uv-button @click="test">跳转登录页面</uv-button>
			</view>
		</view>

		<!-- 登出对话框 -->
		<uv-modal
			ref="logoutModal"
			show-cancel-button
			title="提示"
			align="center"
			content="确定要退出登录吗？"
			@confirm="logoutHandler"
		></uv-modal>

		<!-- 修改密码对话框 -->
		<uv-modal
			ref="editPasswordModal"
			:async-close="true"
			title="修改密码"
			show-cancel-button
			@confirm="editPasswordConfirm"
		>
			<view>
				<uv-form label-width="60" label-position="left" :model="editPasswordForm" :rules="rules" ref="formRef">
					<uv-form-item label="旧密码" required prop="oldPassword">
						<uv-input
							type="password"
							v-model="editPasswordForm.oldPassword"
							placeholder="旧密码"
						></uv-input>
					</uv-form-item>
					<uv-form-item label="新密码" required prop="newPassword">
						<uv-input
							type="password"
							v-model="editPasswordForm.newPassword"
							placeholder="新密码"
						></uv-input>
					</uv-form-item>
					<uv-form-item label="确认密码" required prop="confirmPassword">
						<uv-input
							type="password"
							v-model="editPasswordForm.confirmPassword"
							placeholder="确认密码"
						></uv-input>
					</uv-form-item>
				</uv-form>
			</view>
		</uv-modal>
	</view>
</template>

<style lang="scss" scoped>
.mine {
	background-color: #f5f6f7;
	height: 100%;
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30px;

		.background {
			width: 100%;
			height: 180px;
			/* #ifndef H5 */
			height: 200px;
			/* #endif */
			.background-pic {
				width: 100%;
				height: 100%;
			}
		}

		.user-info {
			position: absolute;
			top: 100px;
			/* #ifndef H5 */
			top: 120px;
			/* #endif */
			z-index: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10px;

			.avatar {
				border: 2px solid #ffffff;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				border-radius: 50%;
			}

			.username {
				font-size: 18px;
				letter-spacing: 2px;
				font-weight: bold;
				margin-top: 2px;
				text-align: center;
			}
		}
	}

	.personalized-signature {
		padding: 10px;
		text-align: center;
		font-size: 14px;
	}

	.bottom-feature {
		padding: 0 16px;
	}
}

// list item bottom border
.uv-list-item::after {
	position: absolute;
	box-sizing: border-box;
	content: ' ';
	pointer-events: none;
	right: 16px;
	bottom: 0;
	left: 16px;
	border-bottom: 1px solid #ebedf0;
	transform: scaleY(0.5);
}
</style>
