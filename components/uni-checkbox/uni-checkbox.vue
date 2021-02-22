<template>
	<view :style="style" class="checkbox-wrapper" @click="handleCheck">
		<view :class="['checkbox', checked && 'active']">
			<uni-icons
				type="checkmarkempty"
				color="#fff"
				style="margin-top: 3px;">
			</uni-icons>
		</view>
		<text class="checkbox-text">{{text}}</text>
	</view>
</template>

<script>
	export default {
		props: ['text', 'style', 'checked'],
		data() {
			// return {
			// 	checked: false
			// };
		},
		methods: {
			handleCheck() {
				// this.checked = !this.checked
				this.$emit('onCheck')
			}
		}
	}
</script>

<style lang="scss">
	.checkbox-wrapper {
		display: flex;
		flex-direction: row;
	}
	.checkbox-text {
		flex: 1;
		margin-left: 4px;
	}
	.checkbox {
		border: 2px solid #ccc;
		width: 24px;
		height: 24px;
		align-items: center;
		border-radius: 4px;
	}
	.active {
		background-color: $uni-color-primary;
		border: 2px solid $uni-color-primary;
	}
</style>
