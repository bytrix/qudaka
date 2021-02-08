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
		onLoad(e) {
			console.log('onload', e)
			const { user_id, username } = e
			this.user.username = username
			this.user.id = user_id
		},
		methods: {
			onIconClick() {
				const that = this
				uni.showLoading()
				uniCloud.callFunction({
					name: 'change_username',
					data: {
						user_id: this.user.id,
						username: this.user.username
					},
					success(res) {
						console.log('change username ok', res)
						model.user.update({
							username: that.user.username
						}, {
							id: that.user.id
						}).then(res => {
							that.$store.commit('user', that.user)
							console.log('用户名修改成功', res)
							uni.hideLoading()
							uni.navigateBack()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
