<template>
	<view>
		<uni-header showBackIcon rightIcon="checkmarkempty" @onIconClick="onIconClick">
			更改昵称
		</uni-header>
		<input v-model="user.username" auto-focus/>
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				user: {
					id: '',
					username: ''
				}
			};
		},
		onLoad({ id, username }) {
			console.log('onload', id, username)
			this.user.username = username
			this.user.id = id
		},
		methods: {
			onIconClick() {
				uni.showLoading()
				uniCloud.callFunction({
					name: 'change_username',
					data: {
						id: this.user.id,
						username: this.user.username
					}
				}).then((res) => {
					return model.user.update({
						username: this.user.username
					}, {
						id: this.user.id
					})
				}).then(res => {
					console.log('用户名修改成功', res)
					uni.hideLoading()
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
