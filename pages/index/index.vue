<template>
	<view class="content">
		<uni-header rightIcon='search'>趣打卡</uni-header>
		<flex-scroll-view>
			<record-card v-for="record in records" :record="record"></record-card>
		</flex-scroll-view>
	</view>
</template>

<script>
	import FlexScrollView from '../../components/flex-scroll-view/flex-scroll-view.vue'
	export default {
		components: {
			FlexScrollView
		},
		data() {
			return {
				records: [],
			}
		},
		onLoad() {
			uni.showLoading()
			const db = uniCloud.database()
			db.collection('record,user')
				.field('user_id{username,avatar,signature},text,images,goal,create_time')
				.orderBy('create_time', 'desc')
				.get()
				.then(({ result }) => {
					console.log('result', result.data)
					this.records = result.data
					uni.hideLoading()
				})
			// uniCloud.callFunction({
			// 	name: 'get_records'
			// }).then(({ result }) => {
			// 	console.log('records', result)
			// 	this.records = result.data
			// })
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
