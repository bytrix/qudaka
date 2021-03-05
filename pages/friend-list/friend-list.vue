<template>
	<view>
		<uni-header title="好友"></uni-header>
		<view style="color: #ccc; text-align: center; padding: 24rpx;" v-if="friends.length === 0">
			暂无任何好友
		</view>
		<uni-list-chat
			v-for="friend in friends"
			:avatar="friend.avatar"
			:title="friend.username"
			:avatarCircle="true"
			link
			@click="toUser(friend)"
			></uni-list-chat>
	</view>
</template>

<script>
	import qs from 'qs'
	export default {
		data() {
			return {
				friends: []
			}
		},
		onShow() {
			this.getFriendList()
		},
		onLoad() {
			this.getFriendList()
		},
		methods: {
			toUser(user) {
				console.log('to user', user)
				const u = qs.stringify(user)
				uni.navigateTo({
					url: '../user/user?' + u
				})
			},
			getFriendList() {
				console.log('on show', this.$store.state.user)
				if(!this.$store.state.user) {
					return
				}
				uni.showLoading()
				const db = uniCloud.database()
				db.collection('user,user').doc(this.$store.state.user.id)
					.field('username,avatar,friend_id{username,avatar}')
					.get()
					.then(({ result }) => {
						console.log('好友', result)
						this.friends = result.data[0].friend_id
						console.log('friends', this.friends)
						uni.hideLoading()
					})
			}
		}
	}
</script>

<style>

</style>
