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
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true)
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
		// background-color: #FFFFFF;
		width: 100%;
	}
	input {
		border-bottom: 1px solid rgba($uni-color-primary, 0.3);
		margin: 12px;
		padding: 6px;
	}
</style>
