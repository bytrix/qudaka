<template>
	<view class="record__card" @click="toRecord" @longpress="handleLongpress">
		<view class="record__header" @click.stop="toUser">
			<image class="record__header__userAvatar" mode="aspectFill" :src="record.user_id[0].avatar"></image>
			<view class="record__header__user">
				<text class="record__header__username">{{record.user_id[0].username}}</text>
				<text class="record__header__goalTrackerText">{{record.goal.goal_name}}，已坚持{{record.goal.times}}天</text>
			</view>
			<view v-if="!isUserSelf">
				<text v-if="isMyFriend(record.user_id[0]._id)" class="record__header__followBtn">取消关注</text>
				<text v-else class="record__header__followBtn">关注TA</text>
			</view>
		</view>
		<text class="record__text">{{record.text}}</text>
		<view class="record__imageGroup" v-if="record.images.length !== 0">
			<image
				@click.stop="viewImage(image)"
				mode="aspectFill"
				v-for="image in cut3images(record.images)"
				class="image"
				:src="image">
			</image>
			<!-- <view
				style="border: 1px solid red; margin: 2px; padding: 2px;"
				v-for="image in cut3images(record.images)">
				{{image}}
			</view> -->
			<!-- <view style="width: 33%">
				<view style="padding-bottom: 100%; position: relative;">
					<image
						mode="aspectFill"
						v-for="image in cut3images(record.images)"
						class="image"
						:src="image">
					</image>
				</view>
			</view> -->
		</view>
		<view style="display: inline-block;">
			<view class="thumbBtn" @click.stop="thumbUp(record._id)">
				<uni-icons
					type="hand-thumbsup"
				></uni-icons>
				<text :class="['thumbBtn__text', {'thumbBtn__text--active': record.thumb_up_by_me}]">{{record.thumb_up_users.length}}</text>
			</view>
			<!-- <view class="thumbBtn" @click.stop="thumbUp(record._id)">
				<uni-icons
					class="thumbBtn__icon"
					type="hand-thumbsup"
					:color="record.thumb_up_by_me ? 'red' : ''">
				</uni-icons>
				<text
					:class="['thumbBtn__text', {'thumbBtn__text--active': record.thumb_up_by_me}]">
					{{record.thumb_up_users.length}}
				</text>
			</view> -->
		</view>
		<text class="fromNow">{{record.fromNow}}发布</text>
	</view>
</template>

<script>
	// import querystring from 'querystring'
	import qs from 'qs'
	import { cutAny } from '../../utils/utils.js'
	import dayjs from 'dayjs'
	
	const cut3 = cutAny(3)
	export default {
		data() {
			return {}
		},
		computed: {
			isUserSelf() {
				if(!this.$store.state.user) {
					return false
				}
				if(this.record.user_id[0]._id === this.$store.state.user.id) {
					return true
				}
			},
			isMyFriend() {
				// if(!this.$store.state.user) {
				// 	return false
				// }
				// if(this.$store.state.user.friend_id)
				const that = this
				return function(user_id) {
					if(!that.$store.state.user) {
						return false
					}
					console.log('user_id', user_id)
					// return this.$store.state.user.friend_id
					console.log('that.$store.state.user', that.$store.state.user)
					console.log('that.$store.state.user.friend_id', that.$store.state.user.friend_id)
					let friend_id = that.$store.state.user.friend_id
					if(friend_id.indexOf(user_id) !== -1) {
						return true
					}
					return false
				}
			}
		},
		methods: {
			viewImage(image) {
				if(!image) {
					return
				}
				console.log('viewImage', image)
				uni.$emit('image-viewer', image)
				console.log('before zoom')
				const imageViewer = uni.getSubNVueById('image_viewer')
				imageViewer.show('zoom-fade-out', 200)
				// imageViewer.show('zoom-out', 100)
				console.log('after zoom', imageViewer)
			},
			handleLongpress() {
				console.log('long..')
				this.$emit('longpress')
			},
			cut3images(arr) {
				// console.log('cut3images arr', arr)
				if(arr.length === 0) return
				return cut3(arr)
			},
			toUser() {
				const u = qs.stringify(this.record.user_id[0])
				// console.log('to user', u)
				uni.navigateTo({
					url: '../../pages/user/user?' + u
				})
			},
			toRecord() {
				console.log('toRecord', this.link)
				if(this.link === false) {
					return
				}
				const user = this.record.user_id[0]
				const p = qs.stringify({
					record_id: this.record._id
				})
				uni.navigateTo({
					url: '../../pages/record/record?' + p
				})
			},
			thumbUp(record_id) {
				console.log('点赞', record_id, this.$store.state)
				uniCloud.callFunction({
					name: 'thumb_up',
					data: {
						record_id,
						user_id: this.$store.state.user.id
					}
				}).then(({ result }) => {
					console.log('点赞成功', result, this.record)
					this.record.thumb_up_by_me = true
					this.record.thumb_up_users.push(this.$store.state.user.id)
					// this.record.thumb_up_count = this.record.thumb_up_count + 1
				}).catch(e => {
					console.log('取消点赞', e)
				})
			}
		},
		props: ['record', 'user', 'link']
	}
</script>

<style lang="scss">
	.record__card {
		// width: 100%;
		flex: 1;
		margin-bottom: 2px;
		padding: 25px 20px 15px 20px;
		box-sizing: border-box;
		background-color: #FFFFFF;
		// background-color: blue;
	}
	.record__header {
		display: flex;
		// width: 100%;
		flex-direction: row;
		flex: 1;
	}
	.record__header__user {
		flex: 1;
		flex-direction: column;
	}
	.record__header__username {
		font-size: 16px;
		display: inline-block;
	}
	.record__header__userAvatar {
		width: 40px;
		height: 40px;
		margin-right: 8px;
		border-radius: 100%;
	}
	.record__text {
		margin: 10px 0px;
		font-size: 16px;
	}
	.record__header__followBtn {
		// font-size: 0.8em;
		font-size: 14px;
		color: $uni-color-primary;
		background-color: rgba($uni-color-primary, 0.15);
		padding: 4px 12px;
		border-radius: 13px;
	}
	.record__imageGroup {
		display: flex;
		margin-bottom: 15px;
		flex-direction: row;
	}
	// .image {
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 100%;
	// 	margin: 0px 2px;
	// 	border-radius: 3px;
	// }
	.image {
		// width: 100%;
		// height: 100%;
		// width: 33.33%;
		// width: 100px;
		flex: 1;
		height: 100px;
		display: inline-block;
		margin: 0px 2px;
		border-radius: 3px;
	}
	.record__header__goalTrackerText {
		color: rgba(0,0,0,0.3);
		font-size: 12px;
		margin-top: 4px;
	}
	.thumbBtn {
		// opacity: 0.4;
		// display: inline-block;
		display: flex;
		flex-direction: row;
		// padding: 15rpx 25rpx;
		margin: 2px;
		// width: 40rpx;
		// height: 40rpx;
	}
	.thumbBtn__icon {
		// margin-right: 6px;
		// background-color: green;
	}
	.thumbBtn__text {
		// font-size: 0.9em;
		font-size: 14px;
		text-align: center;
		margin-left: 4px;
		// opacity: 0.5;
	}
	.thumbBtn > .thumbBtn__text--active {
		color: red;
	}
	.fromNow {
		color: rgba(0,0,0,0.3);
		// font-size: 0.7em;
		margin-top: 4px;
		font-size: 12px;
	}
</style>
