<template>
	<view>
		<image v-for="image in imageList" class="image" :src="image"></image>
		<view v-if="uploading" class="uploadingProgress">{{uploadProgress}}</view>
		<view class="uploaderButton" @click="handleUpload">
			<uni-icons class="uploaderButton__plusIcon" color="rgba(0,0,0,0.2)" type="plusempty" size="36"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['imageList'],
		data() {
			return {
				progress: 0,
				uploading: false
			};
		},
		computed:{
			uploadProgress() {
				return `${Math.round(this.progress * 100)}%`
			}
		},
		methods:{
			handleUpload() {
				console.log('handleUpload')
				const self = this
				uni.chooseImage({
					success(e) {
						console.log('chooseImage ok...', e)
						const filePath = e.tempFilePaths[0]
						const fileName = e.tempFiles[0].name
						self.uploading = true
						
						plus.zip.compressImage({
							src: filePath,
							dst: new Date().getTime() + '.jpg',
							format: 'jpg',
							width: '100px',
							height: '100px',
							quality: 100,
							overwrite: true
						}, e => {
							console.log('图片压缩', e)
							const reader = new plus.io.FileReader()
							reader.readAsDataURL(e.target)
							reader.onloadend = e => {
								const base64 = e.target.result
								console.log('base64', base64)
							}
						}, err => {
							console.log('压缩错误', err)
						})
						
						uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: fileName,
							onUploadProgress({ loaded, total }) {
								self.progress = loaded / total
								console.log('onUploadProgress', loaded, total)
							},
							success(e) {
								self.uploading = false
								self.$emit('onImageUpload', e.fileID)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.uploadingProgress {
		color: rgba(0,0,0,0.4);
		width: 100px;
		height: 100px;
		display: inline-block;
		vertical-align: top;
		text-align: center;
		line-height: 100px;
	}
	.uploaderButton {
		border: 2px dashed rgba(0,0,0,0.15);
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		display: inline-block;
		box-sizing: border-box;
		vertical-align: top;
	}
	.image {
		width: 100px;
		height: 100px;
		display: inline-block;
	}
</style>
