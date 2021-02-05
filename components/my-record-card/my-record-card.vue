<template>
	<view class="record__card">
		<view class="record__header">
			<view class="record__header__user">
				<view class="record__header__goalName">
					{{record.goal.goal_name}}
				</view>
			</view>
		</view>
		<view class="record__text">{{record.text}}</view>
		<view class="record__imageGroup">
			<image mode="aspectFill" v-for="image in cut3images(record.images)" class="image" :src="image"></image>
		</view>
		<view class="record_time">{{record.create_time}}</view>
	</view>
</template>

<script>
	import { cutAny } from '../../utils/utils.js'
	const cut3 = cutAny(3)
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			cut3images(arr) {
				if(arr.length === 0) return
				return cut3(arr)
			}
		},
		props: ['record']
	}
</script>

<style lang="scss">
	.record__card {
		width: 100%;
		// margin: 15px 0px;
		margin-bottom: 15px;
		padding: 25px 15px;
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
	.record__header__goalName {
		font-size: 0.7em;
		color: $uni-color-primary;
		background-color: rgba($uni-color-primary, 0.15);
		display: inline-block;
		padding: 0px 8px;
		height: 22px;
		line-height: 22px;
		border-radius: 14px;
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
		font-size: 0.8em;
		color: $uni-color-primary;
		background-color: rgba($color: $uni-color-primary, $alpha: 0.15);
		padding: 4px 12px;
		border-radius: 13px;
	}
	.record__imageGroup {
		display: flex;
	}
	.image {
		// width: 100px;
		height: 100px;
		margin: 0px 2px;
		border-radius: 3px;
	}
	.record__header__goalTrackerText {
		color: rgba(0,0,0,0.3);
		font-size: 0.8em;
		margin-top: 0.15em;
	}
	.record_time {
		font-size: 0.8em;
		color: rgba(0,0,0,0.2);
		margin-top: 12px;
	}
</style>
