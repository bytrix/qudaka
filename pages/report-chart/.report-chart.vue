<template>
	<view>
		<uni-header showBackIcon title="统计"></uni-header>
		<!-- {{JSON.stringify(ids)}} -->
		<view class=" ganttLine" v-for="goal in goals">
			<view class="ganttLine__taskName">
				{{goal.goal_name}}
			</view>
			<view class="ganttLine__taskStatus">
				<text v-if="goal.times === 0 && goal.passed_seconds < goal.total_seconds">未开始</text>
				<text v-else-if="goal.times !== 0 && goal.passed_seconds < goal.total_seconds" style="color: #007AFF;">进行中</text>
				<text v-else-if="goal.times === 0 && goal.passed_seconds >= goal.total_seconds" style="color: #FF5A5F;">已逾期</text>
				<text v-else style="color: #4CD964">已完成</text>
			</view>
			<view style="flex: 1; padding: 5px;">
				<view class="ganttLine__taskTimeline--total" :style="{width: 340 * (goal.total_seconds / max_duration) + 8 + 'rpx'}">
					<view
						class="ganttLine__taskTimeline--passDays"
						:style="{
							width: 350 * ((goal.passed_seconds < max_duration && (goal.repeat && goal.times > 0) || (!goal.repeat && goal.times === 0) ) ? goal.passed_seconds / max_duration : goal.total_seconds / max_duration) + 'rpx',
						}" >
						<view
							class="ganttLine__taskTimeline--current"
							:style="{width: 350 * ((goal.times < max_duration && (goal.repeat && goal.times > 0) || (!goal.repeat && goal.times === 0) ) ? goal.times / max_duration : goal.total_seconds / max_duration) + 'rpx'}"></view>
					</view>
				</view>
				<view class="ganttLine__taskTimeline--percent">
					{{Math.round((
						(
							(goal.repeat && goal.times > 0) || (!goal.repeat && goal.times === 0)
						) ? (goal.times / goal.total_seconds) : 1
					) * 100) + '%'}}
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
				// goals: [],
				goals: [
					{
					    "create_by": "60350c3d171e740001dcb912",
					    "goal_name": "刷题",
					    "start_time": "11:31",
					    "end_time": "13:31",
					    "timestamp": 1614137518665,
					    "times": 0,
					    "priority": "normal",
					    "repeat": true,
					    "repeat_times": 6
					}
				],
				max_duration: 25, // 所有目标的最长周期（单位：秒），用于整体样式排版
			}
		},
		// onLoad({ ids }) {
		// 	// console.log('on load', e)
		// 	this.ids = ids.split(',')
		// },
		onLoad({user_id}) {
			// const _goals = JSON.parse(goals)
			const that = this
			// this.goals = _goals.map(_ => {
			// 	const total_seconds =  dayjs(_.end_time).diff(_.start_time, 'd') + 1
			// 	const passed_seconds = dayjs().diff(_.start_time, 'd') + 1
			// 	that.max_duration = Math.max(that.max_duration, total_seconds)
			// 	return {
			// 		..._,
			// 		total_seconds,
			// 		passed_seconds
			// 	}
			// })
			// console.log('this.goals', this.goals)
			console.log('user_id', user_id)
			uniCloud.callFunction({
				name: 'get_goal',
				data: {
					user_id
				},
				success({ result }) {
					console.log('get goals', result.data)
					that.goals = result.data.map(_ => {
						const start_time = dayjs(`0000-00-00 ${_.start_time}`)
						const end_time = dayjs(`0000-00-00 ${_.end_time}`)
						const now_HHmmss = dayjs().format('HH:mm:ss')
						const now = dayjs(`0000-00-00 ${now_HHmmss}`)
						// console.log('now->>', now)
						// console.log('now_HHmmss', now_HHmmss)
						const total_seconds = end_time.diff(start_time, 's')
						const passed_seconds = now.diff(start_time, 's')
						console.log('passed_seconds', passed_seconds)
						that.max_duration = Math.max(that.max_duration, total_seconds)
						return {
							..._,
							total_seconds,
							passed_seconds: passed_seconds > total_seconds ? total_seconds : passed_seconds
						}
					})
				}
			})
			// this.goals = [
			// 	{
			// 		goal_name: 'aa',
			// 		total_seconds: 10,
			// 		passed_seconds: 2,
			// 		times: 2
			// 	}
			// ]
			// console.log('goals', this.goals)
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
// page {
// 	padding: $page-padding;
// }
.ganttLine {
	display: flex;
	.ganttLine__taskName,
	.ganttLine__taskStatus {
		padding: 6px;
	}
	.ganttLine__taskName {
		font-weight: bold;
		min-width: 55px;
		font-size: 0.8em;
		text-align: right;
		// background-color: red;
	}
	.ganttLine__taskStatus {
		min-width: 40px;
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
		box-sizing: content-box;
	}
	.ganttLine__taskTimeline--total {
		display: inline-block;
		background-color: rgba(0,0,0,0.05);
		padding: 4px;
		border-radius: 8px;
		box-sizing: content-box;
		// box-sizing: border-box;
	}
	.ganttLine__taskTimeline--passDays {
		background-color: rgba($uni-color-primary, 0.2);
		// box-sizing: border-box;
		box-sizing: content-box;
		border-radius: 4px;
		padding: 2px;
	}
	// .ganttLine__taskTimeline--passDays--default {
	// 	background-color: rgba($uni-color-primary, 0.4);
	// }
	// .ganttLine__taskTimeline--passDays--error {
	// 	background-color: rgba($uni-color-error, 0.4);
	// }
	.ganttLine__taskTimeline--current {
		box-sizing: border-box;
		height: 4px;
		background-color: $uni-color-primary;
		border-radius: 2px;
	}
}
</style>
