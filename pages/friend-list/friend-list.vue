<template>
	<view>
		<uni-header>好友</uni-header>
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
	import querystring from 'querystring'
	export default {
		data() {
			return {
				friends: []
			}
		},
		onShow() {
			console.log('on show', this.$store.state.user)
			if(!this.$store.state.user) {
				return
			}
			const db = uniCloud.database()
			db.collection('user,user').doc(this.$store.state.user.id)
				.field('username,avatar,friend_id{username,avatar}')
				.get()
				.then(({ result }) => {
					console.log('好友', result)
					this.friends = result.data[0].friend_id
					console.log('friends', this.friends)
				})
		},
		methods: {
			toUser(user) {
				console.log('to user', user)
				const u = querystring.stringify(user)
				uni.navigateTo({
					url: '../user/user?' + u
				})
			}
		}
	}
</script>

<style>

</style>
