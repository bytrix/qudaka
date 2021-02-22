<template>
	<view :class="['button', type]" @click="handleClick">
		<text :class="`${type}__text`">{{text}}</text>
	</view>
</template>

<script>
	export default {
		props: ['text', 'type'],
		data() {
			return {
				
			};
		},
		methods: {
			handleClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.button {
	padding: 12px 24px;
	background-color: $uni-bg-color-hover;
	border-radius: 4px;
}
.primary {
	background-color: $uni-color-primary;
}
.primary__text {
	color: #FFFFFF;
}
</style>
