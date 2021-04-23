<template>
	<view>
		<uni-header showBackIcon>统计</uni-header>
		<pie
			:colors="['#e6e6e6', '#007aff']"
			:angle="[0, finish/total*360]"
			:extra="{finish, total}"
			:radius="200"/>
	</view>
</template>

<script>
	import pie from './pie.vue'
	export default {
		components: {
			pie
		},
		data() {
			return {
				total: 0,
				finish: 0
			}
		},
		onLoad({ total, finish }) {
			this.total = total
			this.finish = finish
		}
	}
</script>

<style lang="scss">
</style>
