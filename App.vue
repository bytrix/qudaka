<script>
	import model from 'sqlite_db/model/index.js'
	export default {
		computed: {
			user() {
				return this.$store.state.user
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			const self = this
			uni.getSystemInfo({
				success(res) {
					const scrollHeight = res.windowHeight - self.$headerHeight
					console.log('getSystemInfo', res.windowHeight, self.$headerHeight)
					self.$store.commit('scrollHeight', scrollHeight)
				}
			})
			
			// #ifdef APP-PLUS
			// plus.navigator.setFullscreen(true)
			if(this.$store.state.user) {
				// this.user = this.$store.state.user
				this.isLogin = true
			} else {
				model.user.get().then(u => {
					// this.user = objectPropFill(u, '未填写')
					this.isLogin = true
					this.$store.state.user = u
					// this.$store.commit('user', u)
				})
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			// const self = this
			// uni.getSystemInfo({
			// 	success(res) {
			// 		// const scrollHeight = res.windowHeight - self.$headerHeight
			// 		const scrollHeight = res.windowHeight
			// 		console.log('getSystemInfo', res.windowHeight, self.$headerHeight)
			// 		self.$store.state.scrollHeight = scrollHeight
			// 		// self.$store.commit('scrollHeight', scrollHeight)
			// 	}
			// })
		},
		onHide: function() {
			console.log('App Hide')
		},
		onReady: function() {
			console.log('onReady')
		}
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: $uni-bg-color-grey;
		box-sizing: border-box;
	}
	// textarea {
	// 	width: 100%;
	// }
	.input {
		border-bottom: 1px solid rgba(0,0,0,0.1);
		margin: 14px;
		text-indent: 8px;
		padding: 14px;
	}
</style>
