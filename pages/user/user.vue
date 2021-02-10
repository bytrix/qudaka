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
				<view @click="follow" style="height: 64px; line-height: 64px;">
					<view class="followBtn">关注</view>
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
				records: []
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
		onLoad(user) {
			this.user = user
			console.log('user', this.user)
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
							that.$store.commit('user', {
								...u,
								friend_id: result
							})
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
