<template>
	<view>
		<uni-header icon='gear'>我的</uni-header>
		<image v-if="isLogin" class="avatar" :src="user.avatar"></image>
		<view v-if="isLogin" class="username">{{user.username}}</view>
		<view v-if="!isLogin" class="loginBtn" @click="login">点击登陆</view>
	</view>
</template>

<script>
	import UniHeader from '../../components/uni-header.vue'
	import model from '../../sqlite_db/model/index.js'
	export default {
		components: {
			UniHeader
		},
		onLoad() {
			// #ifdef APP-PLUS
			model.user.get().then(u => {
				this.user = u
				this.isLogin = true
			})
			// #endif
			uniCloud.callFunction({
				name:'get_goal',
				data: {
					user_id: '1'
				}
			}).then(res => {
				console.log('get goal', res)
			})
		},
		data() {
			return {
				isLogin: false,
				user: {}
			}
		},
		methods: {
			login() {
				const that = this
				uni.login({
					provider:'weixin',
					success(loginRes) {
						uni.request({
							url: "https://api.weixin.qq.com/sns/userinfo?access_token="+loginRes.authResult.access_token+"&openid="+loginRes.authResult.openid,
							method: 'GET',
							dataType: 'json',
							header: {
							  'content-type': 'application/x-www-form-urlencoded' // 默认值
							},
							success({ data }) {
								// console.log('【登录回调啾啾啾】',res)
								console.log(`登陆成功：${data.nickname}, ${data.headimgurl}, ${data.unionid}`)
								uni.showToast({
									title: `登陆成功${data.nickname}`
								})
								uniCloud.callFunction({
									name:'signup',
									data:{
										username: data.nickname,
										avatar: data.headimgurl,
										unionid: data.unionid
									}
								}).then(res => {
									that.$store.state.user.username = data.nickname
									that.$store.state.user.avatar = data.headimgurl
									// user.save({
									// 	username: data.nickname,
									// 	avatar: data.headimgurl,
									// 	unionid: data.unionid
									// })
									// user.get().then(res => {
									// 	console.log('?????user get', res)
									// })
									that.$store.commit()
								})
								// that.$api.ajax('smdc/index/applogin', res.data,function(ret){
								// 	console.log("登录接口成功回调：",ret)
								// },'POST',true)
							},
							fail() {
							}
						})
						
					}
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.loginBtn {
		border: 1px solid $uni-color-primary;
		border-radius: 23px;
		color: $uni-color-primary;
		padding: 0px;
		width: 120px;
		text-align: center;
		height: 32px;
		line-height: 32px;
		margin: 32px auto;
	}
	.avatar {
		width: 96px;
		height: 96px;
		border-radius: 100%;
		margin: 0 auto;
		display: block;
		margin-top: 32px;
	}
	.username {
		text-align: center;
		font-size: 1.2em;
		margin-top: 8px;
	}
</style>
