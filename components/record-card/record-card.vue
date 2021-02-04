<template>
	<view class="record__card">
		<view class="record__header">
			<image class="record__header__userAvatar" :src="record.user.avatar"></image>
			<view class="record__header__user">
				{{record.user.username}}
			</view>
			<view>
				<view class="record__header__followBtn">监督TA</view>
			</view>
		</view>
		<view class="record__text">{{record.text}}</view>
		<image v-for="image in record.images" class="image" :src="image"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props: ['record']
	}
</script>

<style lang="scss">
	.record__card {
		width: 100%;
		margin: 5px;
		padding: 15px;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}
	.record__header {
		display: flex;
		width: 100%;
	}
	.record__header__user {
		flex: 1
	}
	.record__header__userAvatar {
		width: 40px;
		height: 40px;
		margin-right: 8px;
		border-radius: 100%;
	}
	.record__text {
		margin: 10px 0px;
	}
	.record__header__followBtn {
		font-size: 0.9em;
		color: $uni-color-primary;
		background-color: rgba($color: $uni-color-primary, $alpha: 0.2);
		padding: 4px 12px;
		border-radius: 13px;
	}
	.image {
		width: 100px;
		height: 100px;
		margin-right: 8px;
		border-radius: 3px;
	}
</style>
