<template>
	<view class="content">
		<uni-header rightIcon='search'>趣打卡</uni-header>
		<flex-scroll-view>
			<record-card v-for="record in records" :record="record"></record-card>
		</flex-scroll-view>
	</view>
</template>

<script>
	import UniHeader from '../../components/uni-header.vue'
	import FlexScrollView from '../../components/flex-scroll-view/flex-scroll-view.vue'
	export default {
		components: {
			UniHeader,
			FlexScrollView
		},
		data() {
			return {
				title: 'Hello',
				records: []
			}
		},
		onLoad() {
			uniCloud.callFunction({
				name: 'get_records'
			}).then(({ result }) => {
				this.records = result.data
			})
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
