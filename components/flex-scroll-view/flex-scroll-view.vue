<template>
	<scroll-view scroll-y="true" :style="{height: (this.$store.state.scrollHeight)+'px'}">
		<slot></slot>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss">

</style>
