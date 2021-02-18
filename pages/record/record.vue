<template>
	<view>
		<uni-header showBackIcon></uni-header>
		<flex-scroll-view>
			<!-- <view class="banner">
				<image mode="aspectFill" class="avatar" :src="user.avatar"></image>
				<view class="banner__text">
					<view>{{user.username}}</view>
					<view class="banner__text__signature">{{user.signature}}</view>
				</view>
				<view style="height: 64px; line-height: 64px;">
					<view class="followBtn">关注</view>
				</view>
			</view> -->
			<record-card v-if="record" :record="record" :link="false"></record-card>
		</flex-scroll-view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh-cn'
	
	dayjs.extend(relativeTime)
	dayjs.locale('zh-cn')
	
	export default {
		data() {
			return {
				record: null,
				user: {}
			};
		},
		onLoad({ record_id }) {
			console.log('on Load', record_id)
			this.getData(record_id, true)
		},
		// onShow({ record_id }) {
		// 	console.log('on show', record_id)
		// 	this.getData(record_id)
		// },
		// onLoad({ text, goal_name, avatar, username, create_time, images }) {
		// 	this.record = {
		// 		text,
		// 		create_time,
		// 		goal: {
		// 			goal_name
		// 		},
		// 		images: images !== '' ? images.split(',') : []
		// 	}
		// 	this.user = {
		// 		avatar,
		// 		username
		// 	}
		// }
		methods: {
			getData(record_id, loading = false) {
				console.log('onload', record_id)
				const that = this
				if(loading) {
					uni.showLoading()
				}
				const db = uniCloud.database()
				db.collection('record,user')
					.doc(record_id)
					.field('user_id{avatar,username,signature},text,goal,images,thumb_up_users,create_time')
					.get()
					.then(({ result }) => {
						console.log('record...', result.data)
						this.record = result.data[0]
						this.record.thumb_up_by_me = this.record.thumb_up_users.indexOf(that.$store.state.user.id) !== -1
						this.record.fromNow = dayjs(this.record.create_time).fromNow()
						console.log('this.record', this.record)
						uni.hideLoading()
					})
			}
		}
	}
</script>

<style lang="scss">
	.banner {
		background-color: #FFFFFF;
		padding: 24px;
		display: flex;
		margin-bottom: 16px;
	}
	.avatar {
		width: 64px;
		height: 64px;
		border-radius: 100%;
	}
	.banner__text {
		vertical-align: middle;
		margin-left: 15px;
		flex: 1;
		height: 64px;
	}
	.banner__text__signature {
		font-size: 0.9em;
		color: #bbbbbb;
		margin-top: 0.5em;
	}
	.followBtn {
		box-shadow: 0px 0px 1px 1px $uni-color-primary;
		width: 80px;
		text-align: center;
		color: $uni-color-primary;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
		display: inline-block;
	}
</style>
