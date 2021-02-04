<template>
	<view>
		<form @submit="addRecord">
			<uni-header showBackIcon leftIcon='plus'>打卡</uni-header>
			<image-uploader
				:imageList="imageList"
				@onImageUpload="onImageUpload"
			/>
			<textarea name='text' placeholder="写下你的打卡宣言"></textarea>
			<button type="primary" form-type="submit">打卡</button>
		</form>
	</view>
</template>

<script>
	import UniHeader from '../../components/uni-header.vue'
	import ImageUploader from '../../components/image-uploader/image-uploader.vue'
	export default {
		components: {
			UniHeader,
			ImageUploader
		},
		data() {
			return {
				imageList: [
					'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-925b53fb-a580-41ad-9002-f322bf4f2d17/6f9a9dfb-2f8e-4286-9df3-09fe16debed7.jpeg',
					'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-925b53fb-a580-41ad-9002-f322bf4f2d17/dd435e15-470c-4952-b45a-f2a1abb7d6b7.jpeg'
				]
			}
		},
		onLoad() {
			uniCloud.getTempFileURL({
				fileList:[
					'a435743a-a609-4555-9f4a-22feb3abebfe'
				]
			}).then(res => {
				console.log(res)
			})
		},
		methods: {
			addRecord(formData) {
				console.log('发布', this.imageList, formData)
				const self = this
				uniCloud.callFunction({
					name: 'add_record',
					data:{
						images: this.imageList,
						user: {
							// username: 'tom',
							// avatar: ''
							username: self.$user.username,
							avatar: self.$user.avatar
						},
						text: formData.detail.value.text
					}
				}).then(res => {
					console.log('发布成功', res)
				})
			},
			onImageUpload(imageUrl) {
				this.imageList.push(imageUrl)
			}
		}
	}
</script>

<style>
</style>
