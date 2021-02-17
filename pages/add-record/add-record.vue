<template>
	<view>
		<uni-header showBackIcon leftIcon='plus'>{{goal.name}}</uni-header>
		<view class="encourageWords">
			<text v-if="goal.times === 0">坚持就是胜利！</text>
			<text v-else-if="goal.times !== 0 && now === goal.update_time">今天已经打过卡了</text>
			<text v-else>再坚持{{goal.left_days}}天，加油哦～</text>
		</view>
		<form @submit="addRecord">
			<image-uploader
				:imageList="imageList"
				@onImageUpload="onImageUpload"
			/>
			<textarea name='text' class="textarea" placeholder="写下你的打卡宣言"></textarea>
			<button :disabled="now === goal.update_time" type="primary" class="submitBtn" form-type="submit">打卡</button>
		</form>
	</view>
</template>

<script>
	import ImageUploader from '../../components/image-uploader/image-uploader.vue'
	import dayjs from 'dayjs'
	import model from '../../sqlite_db/model/index.js'
	export default {
		components: {
			ImageUploader
		},
		data() {
			return {
				imageList: [],
				goal: {
					id: '',
					name: '',
					times: 0
				}
			}
		},
		computed: {
			now() {
				return dayjs().format('YYYY-MM-DD')
			}
		},
		onLoad(p) {
			this.goal = {
				id: p.id,
				name: p.goal_name,
				times: parseInt(p.goal_times),
				left_days: p.left_days,
				update_time: p.update_time
			}
			console.log('this.goal', this.goal)
		},
		methods: {
			addRecord(formData) {
				model.user.get()
				.then(u => {
					console.log('local user', u)
					uni.showLoading()
					return uniCloud.callFunction({
						name: 'add_record',
						data:{
							images: this.imageList,
							// user: {
							// 	username: u.username,
							// 	avatar: u.avatar,
							// 	unionid: u.unionid
							// },
							goal: {
								goal_name: this.goal.name,
								times: this.goal.times + 1
							},
							// goal_id: this.goal.id,
							user_id: u.id,
							text: formData.detail.value.text,
							create_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
						}
					})
				})
				.catch(e => {
					console.log('错误', e)
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: e,
						position: 'bottom'
					})
					return new Promise(() => {})
				})
				.then(() => {
					console.log('update_goal....', this.goal)
					return uniCloud.callFunction({
						name: 'update_goal',
						data: {
							goal_id: this.goal.id,
							times: this.goal.times + 1,
							update_time: dayjs().format('YYYY-MM-DD')
						}
					})
				})
				.then(() => {
					return uni.reLaunch({
						url: '../goal-list/goal-list'
					})
				})
				.then(() => {
					uni.hideLoading()
					uni.showToast({
						title: '打卡成功'
					})
				})
			},
			onImageUpload(imageUrl) {
				this.imageList.push(imageUrl)
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding: $page-padding;
	}
	.encourageWords {
		color: $uni-text-color;
		text-align: center;
		padding: $page-padding;
	}
	.submitBtn {
		margin-top: $uni-spacing-col-base;
	}
	.textarea {
		margin-top: $uni-spacing-col-base;
		padding: $page-padding;
	}
</style>
