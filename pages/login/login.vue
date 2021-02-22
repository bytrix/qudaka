<template>
	<view>
		<uni-header showBackIcon></uni-header>
		<view class="loginTip">手机号登陆</view>
		<form @submit="login">
			<input name="phone" placeholder="手机号" v-model="phone"/>
			<input name="password" :password="true" placeholder="密码" v-model="password"/>
			<button :loading="btnLoading" type="primary" form-type="submit" :disabled="btnDisabled">登陆/注册</button>
		</form>
	</view>
</template>

<script>
	import { randomUsername } from '../../utils/utils.js'
	import md5 from 'md5'
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				phone: '',
				password: '',
				btnLoading: false
			}
		},
		computed: {
			btnDisabled() {
				return this.phone==='' || this.password === '' || this.btnLoading
			}
		},
		methods: {
			login({ detail }) {
				const { value } = detail
				const { phone, password } = value
				if(!this.isValidPhone(phone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					})
					return
				}
				if(!this.isValidPassword(password)) {
					uni.showToast({
						icon: 'none',
						title: '密码长度至少6位数'
					})
					return
				}
				this.btnLoading = true
				uniCloud.callFunction({
					name: 'login',
					data: {
						phone: phone,
						password: md5(password),
						username: randomUsername(),
						avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201704%2F27%2F20170427155254_Kctx8.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615598582&t=869999991b8ff2677d3020f320fda1b4'
					}
				}).then(async ({ result }) => {
					console.log('登陆注册成功', result)
					// #ifdef APP-PLUS
					await model.user.truncate()
					return model.user.save({
						id: result.id,
						username: result.username,
						phone: result.phone,
						avatar: result.avatar,
						gender: result.gender,
						location: result.location,
						birthday: result.birthday,
						signature: result.signature,
						friend_id: result.friend_id.join(',')
					}).catch(e => {
						console.error('本地存储用户失败', e)
						if(e.code === -1404) {
							console.log('新建本地数据库')
							return model.user.truncate()
						}
					}).then((e) => {
						console.log('commit state in login', result, e)
						this.$store.commit('user', {
							id: result.id,
							username: result.username,
							phone: result.phone,
							avatar: result.avatar,
							gender: result.gender,
							location: result.location,
							birthday: result.birthday,
							signature: result.signature,
							friend_id: result.friend_id
						})
						uni.switchTab({
							url: '../my/my'
						})
					}).finally(() => {
						this.btnLoading = false
					})
					// #endif
					// #ifdef H5
					uni.switchTab({
						url: '../my/my'
					})
					this.btnLoading = false
					// #endif
				}).catch(e => {
					console.log('登陆失败', e.toString())
					uni.showToast({
						title: '密码错误',
						position: 'bottom',
						icon: 'none'
					})
				}).finally(() => {
					this.btnLoading = false
				})
			},
			isValidPhone(phone) {
				return /^1[3-9]\d{9}$/.test(phone)
			},
			isValidPassword(password) {
				return /^\w{6,}$/.test(password)
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: white;
	}
	// input {
	// 	margin: 15px;
	// 	padding: 15px;
	// 	text-indent: 10px;
	// 	border-bottom: 1px solid rgba(0,0,0,0.1);
	// }
	button {
		margin: 24px;
	}
	.loginTip {
		font-size: 1.5em;
		margin-top: 1em;
		text-align: center;
	}
</style>
