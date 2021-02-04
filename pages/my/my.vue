<template>
	<view>
		<image class="avatar" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3869515018,2735128030&fm=26&gp=0.jpg"></image>
		<view class="username">username</view>
		<uni-list>
			<uni-list-item :clickable="true" title="修改密码"></uni-list-item>
			<uni-list-item :clickable="true" title="我的目标"></uni-list-item>
			<uni-list-item :clickable="true" @click="create_group" title="制定目标"></uni-list-item>
			<uni-list-item :clickable="true" title="退出账号"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			create_group() {
				uni.navigateTo({
					url:"../create-group/create-group"
				})
			}
		}
	}
</script>

<style>
	page {
		text-align: center;
	}
	.avatar {
		width: 180rpx;
		height: 180rpx;
		border-radius: 100%;
	}
	.username {
		margin-bottom: 48rpx;
		color: #AAAAAA;
	}
</style>
