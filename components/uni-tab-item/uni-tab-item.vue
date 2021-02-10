<template>
	<view>
		<view class="tab__button">
			{{tab}}
		</view>
		<view v-show="tabKey === currentTabKey" class="tab__body">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['tab', 'tabKey'],
		data() {
			return {
				currentTabKey: 'tab1'
			};
		}
	}
</script>

<style lang="scss">
	.tab__button {
		display: inline-block;
		margin: 10px;
		width: 100px;
		flex: 1;
		text-align: center;
		background-color: blue;
	}
	.tab__body {
		background-color: red;
		// width: 100%;
		display: block;
	}
</style>
