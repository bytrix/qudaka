<template>
	<view>
		<uni-header title="我的"></uni-header>
		<!-- <image src="../../static/bg.jpeg"></image> -->
		<view v-if="user!==null">
			<uni-list>
				<uni-list-item class="listItem" :clickable="true" @click="changeAvatar" link>
					<template slot="header">
						<text style="line-height: 48px; color: #3b4144; font-size: 14px;">头像</text>
					</template>
					<template slot="footer">
						<image mode="aspectFill" class="listItemTop__avatar" :src="user.avatar"></image>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" :clickable="true" title="昵称" @click="changeUsername" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.username}}</text>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" title="手机号">
					<template slot="footer">
						<text class="listItem__footerText">{{user.phone}}</text>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" :clickable="true" title="性别" @click="changeGender" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.gender || empty}}</text>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" :clickable="true" title="常住地" @click="changeLocation" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.location || empty}}</text>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" :clickable="true" title="生日" @click="changeBirthday" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.birthday || empty}}</text>
					</template>
				</uni-list-item>
				<uni-list-item class="listItem" :clickable="true" title="签名" @click="changeSignature" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.signature || empty}}</text>
					</template>
				</uni-list-item>
			</uni-list>
			<button class="logoutBtn" type="warn" @click="logout">退出登陆</button>
		</view>
		<view v-else class="loginBtn" @click="toLogin">点击登陆</view>
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	import db from '../../sqlite_db/db.js'
	import { objectPropFill } from '../../utils/utils.js'
	import qs from 'qs'
	export default {
		data() {
			return {
				// isLogin: false,
				// user: {
				// 	id: '123',
				// 	username: 'jack'
				// }
				empty: '未填写'
			}
		},
		computed: {
			user() {
				return this.$store.state.user
			}
		},
		// onShow() {
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: 'user:' + JSON.stringify(this.$store.state.user)
		// 	})
		// 	// #ifdef H5
		// 	this.isLogin = true
		// 	// #endif
		// },
		methods: {
			create_group() {
				uni.navigateTo({
					url:"../create-group/create-group"
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			changeAvatar() {
				const that = this
				uni.chooseImage({
					success(e) {
						uni.showLoading()
						const filePath = e.tempFilePaths[0]
						console.log('filePath', filePath)
						return uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: filePath,
							onUploadProgress(e) {
								console.log('on upload progress', e)
							},
							success(e) {
								console.log('ok', e.fileID)
								uniCloud.callFunction({
									name: 'change_user_avatar',
									data: {
										user_id: that.user.id,
										avatar: e.fileID
									}
								}).then(() => {
									return model.user.update({
										avatar: e.fileID
									}, {
										id: that.user.id
									})
								}).then(() => {
									that.user.avatar = e.fileID
									uni.hideLoading()
								})
							}
						})
					}
				})
			},
			changeUsername() {
				const p = qs.stringify({
					username: this.user.username,
					user_id: this.user.id
				})
				console.log('navigate to username', p)
				uni.navigateTo({
					url: '../edit-username/edit-username?' + p
				})
			},
			changeGender() {
				const genderList = ['男', '女']
				uni.showActionSheet({
					itemList: genderList,
					success: ({ tapIndex }) => {
						uni.showLoading()
						const gender = genderList[tapIndex]
						uniCloud.callFunction({
							name: 'change_gender',
							data: {
								user_id: this.user.id,
								gender
							}
						}).then(() => {
							return model.user.update({
								gender
							}, {
								id: this.user.id
							})
						}).then(() => {
							this.user.gender = gender
							console.log('this.user', this.user)
							this.$store.commit('user', {
								gender: gender
							})
							uni.hideLoading()
						})
					}
				})
			},
			changeBirthday() {
				uni.navigateTo({
					url: '../change-birthday/change-birthday?user_id=' + this.user.id
				})
			},
			changeLocation() {
				uni.navigateTo({
					url: '../change-location/change-location?user_id=' + this.user.id
				})
			},
			changeSignature() {
				const p = qs.stringify({
					user_id: this.user.id,
					signature: this.user.signature
				})
				uni.navigateTo({
					url: '../change-signature/change-signature?' + p
				})
			},
			logout() {
				const that = this
				model.user.truncate().then(() => {
					// that.isLogin = false
					this.$store.state.user = null
				})
			}
		}
	}
</script>

<style lang="scss">
	.listItem {
		padding: 5px 10px;
		// border: 1rpx solid #FFFFFF;
		border: none;
	}
	.listItemTop__avatar {
		width: 48px;
		height: 48px;
		border-radius: 100%;
	}
	.listItemTop__account {
		line-height: 64px;
		margin-left: 20px;
	}
	.listItem__footerText {
		color: rgba(0,0,0,0.4);
	}
	.username {
		margin-bottom: 48rpx;
		color: #AAAAAA;
	}
	.loginBtn {
		border: 1px solid $uni-color-primary;
		color: $uni-color-primary;
		width: 100px;
		text-align: center;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
		margin: 48px auto;
	}
	.logoutBtn {
		margin: 24px;
	}
</style>
