import App from './App'
import uvUI from '@climblee/uv-ui';
import common from '@/utils/common';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
Vue.use(uvUI);
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia';
export function createApp() {
	const app = createSSRApp(App)
	const store = Pinia.createPinia();
	app.use(store);
	app.use(uvUI);
	uni.$toast = common.toast;
	return {
		app,
		Pinia
	}
}
// #endif