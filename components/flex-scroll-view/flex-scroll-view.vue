<template>
	<scroll-view
		scroll-y="true"
		:style="{height: (this.$store.state.scrollHeight)+'px'}">
		<slot></slot>
	</scroll-view>
</template>

<script>
	export default {
		// props: ['refresher-triggered'],
		data() {
			return {
			};
		},
		methods: {
			// handleRefresh() {
			// 	this.$emit('refresherrefresh')
			// }
		}
	}
</script>

<style lang="scss">
</style>
