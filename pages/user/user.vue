<template>
	<view>
		<uni-header showBackIcon></uni-header>
		<flex-scroll-view>
			<view class="banner">
				<image mode="aspectFill" class="avatar" :src="user.avatar"></image>
				<view class="banner__text">
					<view>{{user.username}}</view>
					<view class="banner__text__signature">{{user.signature}}</view>
				</view>
				<view v-if="!isUserSelf">
					<view v-if="followed" @click="unfollow" style="height: 64px; line-height: 64px;">
						<view class="followBtn">取消关注</view>
					</view>
					<view v-else @click="follow" style="height: 64px; line-height: 64px;">
						<view class="followBtn">
							<uni-icons type="plusempty" color="#007aff"></uni-icons>
							<!-- <uni-icons type="spinner-cycle"></uni-icons> -->
							关注
						</view>
					</view>
				</view>
			</view>
			<my-record-card v-for="record in records" :record="record"></my-record-card>
		</flex-scroll-view>
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				user: null,
				records: [],
				followed: false
				// user: {
				// 	"id": "1",
				// 	"phone": "13358212686",
				// 	"username": "杰哥",
				// 	"avatar": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ca86da8b-d75c-4ebf-a51f-11a2956d84a1/44e8e31f-540f-4892-b70f-3a1fff70b385.jpg",
				// 	"gender": "男",
				// 	"location": "福建省, 厦门市",
				// 	"birthday": "2011-9-8",
				// 	"signature": "Find out your passion."
				// }

			};
		},
		computed:{
			isUserSelf() {
				if(!this.$store.state.user) {
					return false
				}
				if(this.user._id === this.$store.state.user.id) {
					return true
				}
			}
		},
		onLoad(user) {
			this.user = user
			model.user.get().then(u => {
				console.log('local user', u)
				console.log('当前页面的用户', this.user)
				const friend_id = u.friend_id.split(',')
				console.log('登陆用户的好友', friend_id)
				if(friend_id.indexOf(this.user._id) !== -1) {
					console.log('当前页面用户是您的好友')
					this.followed = true
				}
			})
			// console.log('user', this.user)
			const db = uniCloud.database()
			db.collection('record')
				.where({
					user_id: this.user._id
				})
				.get()
				.then(({ result }) => {
					console.log('res.', result.data)
					this.records = result.data
				})
		},
		methods: {
			follow() {
				const that = this
				console.log('current user', this.$store.state.user)
				const current_user = this.$store.state.user
				if(!current_user) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '您未登陆'
					})
					return
				}
				that.followed = true
				uniCloud.callFunction({
					name: 'follow',
					data: {
						user_id: current_user.id,
						friend_id: this.user._id
					},
					success({ result }) {
						console.log('ok??')
						model.user.get().then(u => {
							console.log('before commit', this)
							console.log('result', result)
							console.log('u', u)
							that.$store.commit('user', {
								...u,
								friend_id: result
							})
							return model.user.update({
								friend_id: result.join(',')
							}, {
								id: u.id
							})
						}).then(() => {
							console.log('after commit')
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: '关注成功'
							})
							console.log('关注成功!!', result)
						})
					}
				})
			},
			unfollow() {
				console.log('unfollow...')
				const that = this
				const current_user = this.$store.state.user
				uni.showModal({
					title: '确定取消关注？',
					success({ confirm, cancel }) {
						if(confirm) {
							that.followed = false
							uniCloud.callFunction({
								name: 'unfollow',
								data: {
									user_id: current_user.id,
									friend_id: that.user._id
								}
							}).then(({ result }) => {
								console.log('取消关注成功', result)
								model.user.get().then(u => {
									console.log(11111, u)
									that.$store.commit('user', {
										...u,
										friend_id: result.join(',')
									})
									return model.user.update({
										friend_id: result.join(',')
									}, {
										id: u.id
									})
								}).then(() => {
									console.log(22222)
									uni.showToast({
										icon: 'none',
										position: 'bottom',
										title: '取消关注'
									})
								})
							})
						}
					}
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
