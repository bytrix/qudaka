<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true)
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			const self = this
			uni.getSystemInfo({
				success(res) {
					const scrollHeight = res.windowHeight - self.$headerHeight - 50
					self.$store.state.scrollHeight = scrollHeight
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		onReady: function() {
			console.log('getSystemInfo')
		}
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: $uni-bg-color-grey;
		box-sizing: border-box;
	}
	textarea {
		background-color: #FFFFFF;
		width: 100%;
	}
</style>
