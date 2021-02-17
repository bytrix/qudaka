<template>
	<view class="content">
		<uni-header rightIcon='search'>趣打卡</uni-header>
		<flex-scroll-view>
			<record-card v-for="record in records" :record="record"></record-card>
			<view style="text-align: center; color: #cccccc; margin: 36rpx;">我是有底线的～</view>
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
				triggered: false
			}
		},
		onLoad() {
			this.getData()
			// uniCloud.callFunction({
			// 	name: 'get_records'
			// }).then(({ result }) => {
			// 	console.log('records', result)
			// 	this.records = result.data
			// })
		},
		methods: {
			getData() {
				// uni.showLoading();
				// (async () => {
				// 	const db = await uniCloud.database()
				// 	console.log(777)
				// 	const res = await db.collection('record').aggregate().lookup({
				// 		from: '_thumb_up__record__user',
				// 		localField: '_id',
				// 		foreignField: 'record_id',
				// 		as: 'thumb_users'
				// 	}).end()
				// 	// const res = await db.collection('record').aggregate().get()
				// 	console.log('res', res)
				// })()
				const db = uniCloud.database()
				db.collection('record,user,_thumb_up__record__user')
					.field('user_id{username,avatar,signature},text,images,goal,thumb_up_count,create_time')
					.orderBy('create_time', 'desc')
					.get()
					.then(({ result }) => {
						console.log('result', result.data)
						this.records = result.data
						uni.hideLoading()
					})
			}
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
