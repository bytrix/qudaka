<template>
	<view>
		<view
			:style="{
				'width': `${radius}px`,
				'height': `${radius}px`,
				'background-color': colors[1],
				'background-image': `linear-gradient(${angle[0]+90}deg, ${colors[1]} 50%, ${colors[0]} 50%)`
			}"
			class="pie">
			<view
				class="pie_after"
				:style="{'transform': `rotate(${angle[1]}deg)`}">
			</view>
		</view>
		<view style="width: 160px; margin: 0 auto;">
			<view class="legend">
				<view class="legend_before" :style="{'background-color': colors[0]}"></view>
				未完成事项
				{{total - finish}} / {{total}}
			</view>
			<view class="legend">
				<view class="legend_before" :style="{'background-color': colors[1]}"></view>
				已完成事项
				{{finish}} / {{total}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['angle', 'ratio', 'radius', 'colors', 'extra'],
		computed: {
			total() {
				return this.ratio.reduce((a, b) => a + b)
			}
		},
		data() {
			return {
				finish: this.extra.finish,
				total: this.extra.total
			}
		}
	}
</script>

<style lang="scss">
	.pie {
		// background-color: #e6e6e6;
		// width: 100px;
		// height: 100px;
		border-radius: 100%;
		// background-image: linear-gradient(0deg, $uni-color-primary 50%, #e6e6e6 50%);
		margin: 12px auto;
	}
	.pie_after {
		height: 100%;
		background-color: inherit;
		display: block;
		margin-left: 50%;
		border-radius: 0 100% 100% 0/50%;
		// transform: rotate(45deg);
		transform-origin: left;
	}
	.legend_before {
		// content: '';
		display: inline-block;
		// background-color: $uni-color-primary;
		width: 1em;
		height: 1em;
		vertical-align: -2px;
		margin-right: 8px;
		border-radius: 4px;
	}
</style>
