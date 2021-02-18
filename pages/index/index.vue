<template>
	<view class="content">
		<uni-header rightIcon='search' @onIconClick="toSearch">趣打卡</uni-header>
		<flex-scroll-view>
			<record-card v-for="record in records" :record="record"></record-card>
			<view style="text-align: center; color: #cccccc; margin: 36rpx;">我是有底线的～</view>
		</flex-scroll-view>
	</view>
</template>

<script>
	import FlexScrollView from '../../components/flex-scroll-view/flex-scroll-view.vue'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh-cn'
	
	dayjs.extend(relativeTime)
	dayjs.locale('zh-cn')
	
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
				uni.showLoading();
				const db = uniCloud.database()
				const that = this
				db.collection('record,user')
					.field('user_id{username,avatar,signature},text,images,goal,create_time,thumb_up_users')
					.orderBy('create_time', 'desc')
					.get()
					.then(({ result }) => {
						console.log('result', result.data, dayjs)
						that.records = result.data.map(_ => ({
							..._,
							thumb_up_by_me: _.thumb_up_users.indexOf(that.$store.state.user.id) !== -1,
							fromNow: dayjs(_.create_time).fromNow()
						}))
						console.log('that.records', that.records)
						uni.hideLoading()
					})
			},
			toSearch() {
				console.log('to search.', this.$refs.popup.type)
				// uni.navigateTo({
				// 	url: '../search/search'
				// })
				this.$refs.popup.open()
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
