<template>
	<view>
		<uni-header showBackIcon rightIcon="checkmarkempty" @onIconClick="changeSignature">修改签名</uni-header>
		<input v-model="signature" auto-focus />
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				user_id: '',
				signature: ''
			}
		},
		methods: {
			changeSignature() {
				uni.showLoading()
				uniCloud.callFunction({
					name: 'change_user_signature',
					data: {
						user_id: this.user_id,
						signature: this.signature
					}
				}).then(() => {
					console.log('签名修改成功')
					return model.user.update({
						signature: this.signature
					}, {
						id: this.user_id
					})
				}).then(() => {
					uni.hideLoading()
					uni.switchTab({
						url: '../my/my'
					})
				})
			}
		},
		onLoad({ user_id, signature }) {
			this.user_id = user_id
			this.signature = signature
			console.log('on load', user_id)
		}
	}
</script>

<style>

</style>
