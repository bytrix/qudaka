<template>
	<view>
		<uni-header icon='gear'>我的</uni-header>
		<button @click="login">登陆</button>
	</view>
</template>

<script>
	import UniHeader from '../../components/uni-header.vue'
	export default {
		components: {
			UniHeader
		},
		onLoad() {
			console.log('on load')
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
				// user: {}
			}
		},
		methods: {
			login() {
				const that = this
				console.log('login')
				uni.login({
					provider:'weixin',
					success(loginRes) {
						console.log(loginRes)
						
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
								uniCloud.callFunction({
									name:'signup',
									data:{
										username: data.nickname,
										avatar: data.headimgurl,
										unionid: data.unionid
									}
								}).then(res => {
									console.log('用户注册成功', res)
									self.$user = {
										username: data.nickname,
										avatar: data.headimgurl
									}
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

<style>

</style>
