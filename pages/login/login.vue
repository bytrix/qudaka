<template>
	<form @submit="login">
		<input name="phone" placeholder="手机号" v-model="phone"/>
		<input name="password" :password="true" placeholder="密码" v-model="password"/>
		<button :loading="btnLoading" type="primary" form-type="submit" :disabled="btnDisabled">登陆/注册</button>
	</form>
</template>

<script>
	import { randomUsername } from '../../utils/utils.js'
	import md5 from 'md5'
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				phone: '13358212686',
				password: '12121212',
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
						avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F17%2F20190117092809_ffwKZ.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615175158&t=d581084da521f3bf473d2bbb419abe07'
					}
				}).then(({ result }) => {
					console.log('result', result)
					// #ifdef APP-PLUS
					model.user.save({
						id: result._id,
						username: result.username,
						phone: result.phone,
						avatar: result.avatar,
						gender: result.gender,
						location: result.location,
						birthday: result.birthday,
						signature: result.signature
					}).finally(() => {
						uni.switchTab({
							url: '../my/my'
						})
						this.btnLoading = false
					})
					// #endif
					// #ifdef H5
					uni.switchTab({
						url: '../my/my'
					})
					this.btnLoading = false
					// #endif
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
	input {
		/* background-color: white; */
		margin: 15px;
		padding: 15px;
		text-indent: 10px;
		border-bottom: 1px solid rgba(0,0,0,0.1);
	}
	button {
		margin: 24px;
	}
</style>
