<template>
	<view>
		<uni-header>我的</uni-header>
		<view v-if="isLogin">
			<uni-list>
				<uni-list-item :clickable="true" link>
					<template slot="header">
						<text style="line-height: 48px; color: #3b4144; font-size: 14px;">头像</text>
					</template>
					<template slot="footer">
						<image class="listItemTop__avatar" :src="user.avatar"></image>
					</template>
				</uni-list-item>
				<uni-list-item :clickable="true" title="昵称" @click="changeUsername" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.username}}</text>
					</template>
				</uni-list-item>
				<uni-list-item title="手机号">
					<template slot="footer">
						<text class="listItem__footerText">{{user.phone}}</text>
					</template>
				</uni-list-item>
				<!-- <uni-list-item :clickable="true" @click="create_group" title="制定目标" link></uni-list-item> -->
				<uni-list-item :clickable="true" title="性别" @click="changeGender" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.gender}}</text>
					</template>
				</uni-list-item>
				<uni-list-item :clickable="true" title="常住地" @click="changeLocation" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.location}}</text>
					</template>
				</uni-list-item>
				<uni-list-item :clickable="true" title="生日" @click="changeBirthday" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.birthday}}</text>
					</template>
				</uni-list-item>
				<uni-list-item :clickable="true" title="签名" link>
					<template slot="footer">
						<text class="listItem__footerText">{{user.signature}}</text>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view v-else class="loginBtn" @click="toLogin">点击登陆</view>
		
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	import db from '../../sqlite_db/db.js'
	import { objectPropFill } from '../../utils/utils.js'
	export default {
		data() {
			return {
				isLogin: false,
				user: {
					id: '123',
					username: 'jack'
				}
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			// model.user.truncate()
			// this.isLogin = false
			model.user.get().then(u => {
				this.user = objectPropFill(u, '未填写')
				this.isLogin = true
			})
			// #endif
			// #ifdef H5
			this.isLogin = true
			// #endif
		},
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
			changeUsername() {
				uni.navigateTo({
					url: `../edit-username/edit-username?username=${this.user.username}&id=${this.user.id}`
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
								id: this.user.id,
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
			}
		}
	}
</script>

<style lang="scss">
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
</style>
