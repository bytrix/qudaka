<template>
	<view class="datepicker-group" :style="style">
		<picker :mode="mode" @change="handleChange0" class="datepicker">
			<text class="datepicker__text">{{value[0] || text[0]}}</text>
		</picker>
		<text style="padding: 8px">至</text>
		<picker :mode="mode" @change="handleChange1" class="datepicker">
			<text class="datepicker__text">{{value[1] || text[1]}}</text>
		</picker>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	export default {
		props: ['mode', 'text', 'style'],
		data() {
			return {
				value: [null, null]
			};
		},
		methods: {
			handleChange0({ detail }) {
				this.$set(this.value, 0, detail.value)
				this.$emit('onChange', this.value)
			},
			handleChange1({ detail }) {
				// console.log('handleChange1', detail.value, this.value[0])
				const startTime = dayjs(`0000-00-00 ${this.value[0]}`)
				const endTime = dayjs(`0000-00-00 ${detail.value}`)
				console.log('isBefore', endTime.isAfter(startTime))
				if(endTime.isAfter(startTime)) {
					this.$set(this.value, 1, detail.value)
					this.$emit('onChange', this.value)
				} else {
					uni.showToast({
						position: 'bottom',
						icon: 'none',
						title: '结束时间不能在开始时间前面'
					})
				}
			},
		}
	}
</script>

<style lang="scss">

	.datepicker-group {
		display: flex;
		flex-direction: row;
		padding: 0px 14px;
	}
	.datepicker {
		flex: 1;
		border-bottom: 1px solid #eee;
		padding: 8px;
		text-align: center;
		justify-content: center;
	}
	.datepicker__text {
		width: 100%;
		color: #999;
		text-align: center;
		justify-content: center;
	}
</style>
