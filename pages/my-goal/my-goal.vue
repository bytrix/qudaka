<template>
	<view>
		<uni-header rightIcon='gear'>我的</uni-header>
		<flex-scroll-view>
			<view class="banner">
				<image v-if="isLogin" class="avatar" :src="user.avatar"></image>
				<view v-if="isLogin" class="username">{{user.username}}</view>
			</view>
			<view class="pickerBtn" @click="pickerVisible=true">
				本月
				<uni-icons type="arrowdown"></uni-icons>
			</view>
			<w-picker
				:visible="pickerVisible"
				mode="range"
				@confirm="onPickerConfirm"
				@cancel="pickerVisible=false"
			></w-picker>
			<my-record-card v-for="record in records" :record="record"></my-record-card>
		</flex-scroll-view>
		
		<view v-if="!isLogin" class="loginBtn" @click="login">点击登陆</view>
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	export default {
		onLoad() {
			// #ifdef APP-PLUS
			model.user.get().then(u => {
				this.user = u
				this.isLogin = true
			})
			// #endif
			
			uni.showLoading()
			uniCloud.callFunction({
				name: 'get_records'
			}).then(({ result }) => {
				this.records = result.data.filter(record => record.user.unionid === this.user.unionid)
				uni.hideLoading()
			})
		},
		data() {
			return {
				isLogin: true,
				user: {
					username: 'jack',
					avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F17%2F20190117092809_ffwKZ.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615125018&t=d105df3e12aed1466e64f37cd1b099e1'
				},
				records: [],
				pickerVisible: false
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
			},
			onPickerConfirm({ value }) {
				console.log('confirm', value)
				this.pickerVisible = false
			}
			
		}
	}
</script>

<style lang="scss">
	$avatar-size: 64px;
	.pickerBtn {
		padding: 10px 20px;
		display: inline-block;
	}
	.banner {
		background-color: white;
		padding: 32px 8px;
		display: flex;
	}
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
		width: $avatar-size;
		height: $avatar-size;
		border-radius: 100%;
		margin: 0 auto;
		display: block;
		margin: 0px 16px;
	}
	.username {
		text-align: center;
		font-size: 1.2em;
		flex: 1;
		text-align: left;
		line-height: $avatar-size;
	}
</style>
