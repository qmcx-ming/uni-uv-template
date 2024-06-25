<script>
import { routerInterceptor } from '@/interceptor';
export default {
	onLaunch: function () {
		console.log('App Launch');
		routerInterceptor();
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
// 每个页面公共css
@import '@climblee/uv-ui/index.scss';

// 导航栏底部边框颜色
.uni-page-head {
	border-bottom: 1px solid #ebedf0;
}

// 解决height:100%; -> 高度铺满全屏不生效以及
// 高度使用heiht:100vh,h5的屏幕会多出一些高度，导致页面可以上下滑动
uni-page-body,
html,
body,
page {
	height: 100%;
}
</style>
