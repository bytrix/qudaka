<template>
	<view
		@click="onChange(type)"
		:style="style"
		:class="['checkbadge', active ? `${type}--active` : type]">
		<uni-icons
			type="checkmarkempty"
			:color="active ? '#ffffff' : colors[type]"
			style="margin-right: 4px;">
		</uni-icons>
		{{text}}
	</view>
</template>

<script>
	export default {
		props: ['style', 'text', 'type', 'active'],
		data() {
			return {
				colors: {
					urgent: '#dd524d',
					important: '#f0ad4e',
					normal: '#007aff',
					success: '#4cd964'
				},
			};
		},
		methods: {
			onChange(type) {
				this.$emit('onChange', type)
			}
		}
	}
</script>

<style lang="scss">
.checkbadge {
	color: $uni-color-primary;
	padding: 0.4em 0.8em;
	display: inline-block;
	margin: 0.3em;
	border-radius: 4px;
}
$colors: (
	urgent: $uni-color-error,
	important: $uni-color-warning,
	normal: $uni-color-primary,
	success: $uni-color-success
);
@each $key, $color in $colors {
	.#{$key} {
		background-color: rgba($color, 0.05);
		border: 1px solid rgba($color, 0.2);
		color: $color;
	}
	.#{$key}--active {
		background-color: $color;
		border: 1px solid $color;
		color: #FFFFFF;
	}
}
</style>
