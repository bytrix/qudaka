<template>
	<view>
		tt
		<slot name="byDay"></slot>
		<slot name="byWeek"></slot>
	</view>
	<!-- <view>
		{{active}}
		<slot></slot>
	</view> -->
</template>

<script>
	export default {
		props: ['active']
	}
</script>

<style>
</style>
