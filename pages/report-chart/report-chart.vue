<template>
	<view>
		<uni-header showBackIcon>统计</uni-header>
		<view class=" ganttLine" v-for="goal in goals">
			<view class="ganttLine__taskName">
				{{goal.goal_name}}
			</view>
			<view class="ganttLine__taskStatus">
				<text v-if="goal.times === 0">未开始</text>
				<text v-else-if="goal.times !== 0 && goal.times < goal.total_days">进行中</text>
				<text v-else-if="goal.passed_days > goal.total_days">已逾期</text>
				<text v-else>未知</text>
			</view>
			<view style="flex: 1; padding: 5px;">
				<view class="ganttLine__taskTimeline--total" :style="{width: 350 * (goal.total_days / max_days) + 'rpx'}">
					<view class="ganttLine__taskTimeline--passDays" :style="{width: 350 * (goal.passed_days / max_days) + 'rpx'}" >
						<view class="ganttLine__taskTimeline--current" :style="{width: 350 * (goal.times / max_days) + 'rpx'}"></view>
					</view>
				</view>
				<view class="ganttLine__taskTimeline--percent">
					{{Math.round(goal.times / goal.total_days * 100) + '%'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				goals: [],
				max_days: 0,
			}
		},
		onLoad({goals}) {
			const _goals = JSON.parse(goals)
			const that = this
			this.goals = _goals.map(_ => {
				const total_days =  dayjs(_.end_time).diff(_.start_time, 'd')
				const passed_days = dayjs().diff(_.start_time, 'd') + 1
				that.max_days = Math.max(that.max_days, total_days)
				return {
					..._,
					total_days,
					passed_days
				}
			})
			// this.goals = [
			// 	{
			// 		goal_name: 'aa',
			// 		total_days: 10,
			// 		passed_days: 2
			// 	}
			// ]
			console.log('goals', this.goals)
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
page {
	padding: $page-padding;
}
.ganttLine {
	display: flex;
	.ganttLine__taskName,
	.ganttLine__taskStatus {
		padding: 6px;
	}
	.ganttLine__taskName {
		font-weight: bold;
		width: 70px;
		font-size: 0.8em;
		text-align: right;
		// background-color: red;
	}
	.ganttLine__taskStatus {
		width: 40px;
		font-size: 0.8em;
		// background-color: blue;
	}
	.ganttLine__taskTimeline--percent {
		display: inline-block;
		font-size: 0.7em;
		color: #777777;
		// background-color: red;
		margin-left: 0.4em;
		margin-top: 0px;
		top: 0px;
		vertical-align: 0.4em;
		// height: 10px;
		// width: 10px;
	}
	.ganttLine__taskTimeline--total {
		display: inline-block;
		background-color: rgba(0,0,0,0.05);
		padding: 4px;
		border-radius: 8px;
	}
	.ganttLine__taskTimeline--passDays {
		background-color: rgba($uni-color-primary, 0.4);
		// box-sizing: border-box;
		box-sizing: content-box;
		border-radius: 4px;
		padding: 2px;
	}
	.ganttLine__taskTimeline--current {
		box-sizing: border-box;
		height: 4px;
		background-color: $uni-color-primary;
		border-radius: 2px;
	}
}
</style>
