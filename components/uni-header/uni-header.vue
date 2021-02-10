<template>
	<view>
		<view class="header">
			<view class="header__title_leftIcon">
				<uni-icons v-if="showBackIcon" type="back" size="19" @click="back"></uni-icons>
			</view>
			<text class="header__title">
				<slot></slot>
			</text>
			<uni-icons class="header__title__rightIcon" :type="rightIcon" size="19" @click="handleRightClick"></uni-icons>
			<slot name='right'></slot>
		</view>
		<view class="header__after"></view>
	</view>
</template>

<script>
	export default {
		props: ['showBackIcon', 'leftIcon', 'rightIcon'],
		data() {
			return {
				
			};
		},
		methods:{
			back() {
				uni.navigateBack()
			},
			handleRightClick() {
				this.$emit('onIconClick')
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: fixed;
		top: 0px;
		width: 100%;
		box-sizing: border-box;
		left: 0px;
		background-color: white;
		// background-color: red;
		min-height: $uni-header-height;
		vertical-align: bottom;
		padding: 30px 15px 15px 15px;
		font-weight: bold;
		text-align: center;
		display: flex;
		z-index: 1;
		// opacity: 0.4;
	}
	.header__after {
		min-height: $uni-header-height + 7px;
		// background-color: blue;
	}
	.header__title {
		flex: 1;
	}
	.header__title_leftIcon {
		width: 19px;
	}
	.header__title__rightIcon {
		display: inline-block;
		width: 19px;
	}
</style>
