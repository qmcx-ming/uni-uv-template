<script setup>
import { ref, computed } from 'vue';
import { getUserProfile, updateUserProfile } from '@/api/user';
import useUserStore from '@/stores/modules/user';

const userStore = useUserStore();

const list = ref([
	{
		name: '我的信息'
	},
	{
		name: '编辑信息'
	}
]);

const current = ref(0);

// 编辑信息表单
const form = ref({
	nickname: '',
	phoneNumber: '',
	email: '',
	sex: '2',
	remark: ''
});

// 我的信息
const info = ref({ ...form.value });

const rules = ref({
	nickname: {
		required: true,
		message: '请输入昵称',
		trigger: ['blur', 'change']
	},
	phoneNumber: {
		required: true,
		message: '请输入手机号',
		trigger: ['blur', 'change']
	},
	email: {
		required: true,
		message: '请输入邮箱',
		trigger: ['blur', 'change']
	}
});

const loading = ref(false);

// 触发切换
const switchHandler = (event) => {
	// 有index就是tabs切换，没有就是轮播图切换
	current.value = event.index ? event.index : event.detail?.current;
};

const getSexIconName = computed(() => {
	return (sex) => {
		if (sex === '0') {
			return 'man';
		} else if (sex === '1') {
			return 'woman';
		} else {
			return 'question-circle';
		}
	};
});

// 获取用户信息
const getProfile = async () => {
	const { data } = await getUserProfile();
	// 信息赋值 和 表单赋值
	info.value = { ...data };
	form.value = { ...data };
};

const onSubmit = async () => {
	loading.value = true;
	// 执行修改操作
	await userStore.updateProfile(form.value);
	loading.value = false;
	// 回显到 我的信息
	info.value = { ...form.value };
	uni.showToast({
		icon: 'none',
		title: '修改成功'
	});
};

getProfile();
</script>

<template>
	<view class="profile">
		<uv-tabs
			line-width="40"
			:item-style="{ width: '160px', height: '44px' }"
			:list="list"
			:current="current"
			:active-style="{ fontWeight: 'bold', color: '#323233' }"
			@click="switchHandler"
		></uv-tabs>
		<view class="card">
			<swiper class="card-swiper" :current="current" @change="switchHandler">
				<swiper-item class="card-swiper-item">
					<uv-cell-group :custom-style="{ padding: '10px' }" :border="false">
						<uv-cell
							icon="account-fill"
							:icon-style="{ color: '#323233' }"
							title="昵称"
							:value="info.nickname"
							:center="true"
						></uv-cell>
						<uv-cell
							icon="phone-fill"
							:icon-style="{ color: '#323233' }"
							title="手机号码"
							:value="info.phoneNumber"
							:center="true"
						></uv-cell>
						<uv-cell
							icon="email-fill"
							:icon-style="{ color: '#323233' }"
							title="邮箱"
							:value="info.email"
							:center="true"
						></uv-cell>
						<uv-cell icon="integral-fill" :icon-style="{ color: '#323233' }" title="性别" :center="true">
							<template #value>
								<uv-icon :name="getSexIconName(info.sex)" size="20"></uv-icon>
							</template>
						</uv-cell>
						<uv-cell
							icon="file-text-fill"
							:icon-style="{ color: '#323233' }"
							:title-style="{ width: '100px' }"
							title="个性签名"
							:value="info.remark"
							:center="true"
						></uv-cell>
						<uv-cell
							icon="clock-fill"
							:icon-style="{ color: '#323233' }"
							title="创建日期"
							:value="info.createTime"
							:center="true"
						></uv-cell>
					</uv-cell-group>
				</swiper-item>
				<swiper-item class="card-swiper-item">
					<uv-cell-group :custom-style="{ padding: '10px 20px' }" :border="false">
						<uv-form labelPosition="left" :model="form" :rules="rules" ref="formRef">
							<uv-form-item label="昵称" prop="nickname" borderBottom>
								<uv-input v-model="form.nickname" border="none"></uv-input>
							</uv-form-item>
							<uv-form-item label="手机号码" prop="phoneNumber" borderBottom>
								<uv-input v-model="form.phoneNumber" border="none"></uv-input>
							</uv-form-item>
							<uv-form-item label="邮箱" prop="email" borderBottom>
								<uv-input v-model="form.email" border="none"></uv-input>
							</uv-form-item>
							<uv-form-item label="性别" prop="sex" borderBottom>
								<uv-radio-group v-model="form.sex">
									<uv-radio name="0" label="男" :custom-style="{ padding: '10px' }"></uv-radio>
									<uv-radio name="1" label="女" :custom-style="{ padding: '10px' }"></uv-radio>
									<uv-radio name="2" label="保密" :custom-style="{ padding: '10px' }"></uv-radio>
								</uv-radio-group>
							</uv-form-item>
							<uv-form-item label="个性签名" prop="remark" borderBottom>
								<uv-textarea v-model="form.remark"></uv-textarea>
							</uv-form-item>
							<uv-button
								type="primary"
								text="提交"
								:loading="loading"
								loading-mode="circle"
								loading-text=" "
								customStyle="margin-top: 10px"
								@click="onSubmit"
							></uv-button>
						</uv-form>
					</uv-cell-group>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;

	.card {
		width: 100%;
		height: 100%;

		&-swiper {
			height: 100%;
			&-item {
				width: 100%;
			}
		}
	}
}
</style>
