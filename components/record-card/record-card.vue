<template>
	<view class="record__card" @click="toRecord">
		<view class="record__header" @click.stop="toUser">
			<image class="record__header__userAvatar" mode="aspectFill" :src="record.user_id[0].avatar"></image>
			<view class="record__header__user">
				<view class="record__header__username">{{record.user_id[0].username}}</view>
				<view class="record__header__goalTrackerText">
					{{record.goal.goal_name}}，已坚持{{record.goal.times}}天
				</view>
			</view>
			<!-- {{isMyFriend(record.user_id[0]._id)}} -->
			<view v-if="!isUserSelf">
				<view v-if="isMyFriend(record.user_id[0]._id)" class="record__header__followBtn">取消关注</view>
				<view v-else class="record__header__followBtn">关注TA</view>
			</view>
		</view>
		<view class="record__text">{{record.text}}</view>
		<view class="record__imageGroup" v-if="record.images.length !== 0">
			<image mode="aspectFill" v-for="image in cut3images(record.images)" class="image" :src="image"></image>
		</view>
		<view class="thumbBtn">
			<uni-icons class="thumbBtn__icon" type="hand-thumbsup"></uni-icons>
			<text class="thumbBtn__text">37</text>
		</view>
	</view>
</template>

<script>
	import querystring from 'querystring'
	import { cutAny } from '../../utils/utils.js'
	const cut3 = cutAny(3)
	export default {
		// watch: {
		// 	// link: function(a, b) {
		// 	// 	console.log('watch link', a, b)
		// 	// 	this.link = a
		// 	// }
		// 	// link(n, o) {
		// 	// 	console.log('get link')
		// 	// }
		// },
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
					console.log('that.$store.state.user.friend_id', that.$store.state.user.friend_id)
					let friend_id = that.$store.state.user.friend_id.split(',')
					if(friend_id.indexOf(user_id) !== -1) {
						return true
					}
					return false
				}
			}
		},
		methods: {
			cut3images(arr) {
				if(arr.length === 0) return
				return cut3(arr)
			},
			toUser() {
				const u = querystring.stringify(this.record.user_id[0])
				// console.log('to user', u)
				uni.navigateTo({
					url: '../../pages/user/user?' + u
				})
			},
			toRecord() {
				if(this.link === false) {
					return
				}
				const user = this.record.user_id[0]
				// const p = querystring.stringify({
				// 	text: this.record.text,
				// 	goal_name: this.record.goal.goal_name,
				// 	create_time: this.record.create_time,
				// 	username: user.username,
				// 	avatar: user.avatar,
				// 	images: this.record.images.join(',')
				// })
				const p = querystring.stringify({
					record_id: this.record._id
				})
				uni.navigateTo({
					url: '../../pages/record/record?' + p
				})
			}
		},
		props: ['record', 'user', 'link']
	}
</script>

<style lang="scss">
	.record__card {
		width: 100%;
		// margin: 15px 0px;
		padding: 25px 20px 15px 20px;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}
	.record__header {
		display: flex;
		width: 100%;
	}
	.record__header__user {
		flex: 1
	}
	.record__header__username {
		font-size: 0.9em;
	}
	.record__header__userAvatar {
		width: 40px;
		height: 40px;
		margin-right: 8px;
		border-radius: 100%;
	}
	.record__text {
		margin: 10px 0px;
	}
	.record__header__followBtn {
		font-size: 0.8em;
		color: $uni-color-primary;
		background-color: rgba($color: $uni-color-primary, $alpha: 0.15);
		padding: 4px 12px;
		border-radius: 13px;
	}
	.record__imageGroup {
		display: flex;
		margin-bottom: 15px;
	}
	.image {
		// width: 100px;
		height: 100px;
		margin: 0px 2px;
		border-radius: 3px;
	}
	.record__header__goalTrackerText {
		color: rgba(0,0,0,0.3);
		font-size: 0.8em;
		margin-top: 0.15em;
	}
	.thumbBtn {
		// color: red;
		opacity: 0.4;
	}
	.thumbBtn > .thumbBtn__icon {
		margin-right: 6px;
	}
	.thumbBtn > .thumbBtn__text {
		font-size: 0.9em;
		// opacity: 0.5;
	}
</style>
