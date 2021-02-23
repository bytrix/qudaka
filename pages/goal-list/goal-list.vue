<template>
	<view>
		<uni-header rightIcon='plusempty' @onIconClick="onIconClick">趣打卡</uni-header>
		<view v-if="user" class="statBar">
			<!-- <text class="statInfo" style="background-color: red;">
				{{c_goals.length}}项目标，已完成{{c_goals.filter(_ => _.times === _.diff).length}}项
			</text> -->
			<picker mode="date" @change="handleDate">
				<view style="flex: 1">
					{{date}} 的目标
					<uni-icons type="arrowdown" size="12"></uni-icons>
				</view>
			</picker>
			<view style="flex: 1; text-align: right;" @click="toReportChart">
				查看统计
				<uni-icons type="forward" size="12"></uni-icons>
			</view>
		</view>
		<scroll-view v-if="user" scroll-y="true" :style="{height:scrollHeight+'px'}">
			<uni-swipe-action v-for="goal in goals">
				<uni-swipe-action-item :style="{'opacity': goal.finish ? 0.8 : 1}">
					<template v-slot:right>
						<view class="swipeActionItem__rightOption">
							<!-- <view class="swipeActionItem__rightOption-btn">
								<uni-icons @click="viewGoal" size='18' type="eye" style="color: #007AFF"></uni-icons>
							</view> -->
							<view class="swipeActionItem__rightOption-btn">
								<uni-icons @click="removeGoal(goal._id, goal.goal_name)" size='28' type="closeempty" style="color: #dd524d"></uni-icons>
							</view>
						</view>
					</template>
					<view class="goal" @click="addRecord(goal)">
						<view
							class="goal__board"
							:style="{
								'border-left': goal.finish ? '#eee' : `4px solid ${priority_colors[goal.priority]}`,
							}">
							<view :class="['goal__goalName', {'goal__disabled':goal.diff === goal.times}]">
								<view>
									<text
										v-if="!goal.finish"
										:style="{'background-color': priority_colors[goal.priority]}"
										class="priorityLabel">
										{{priority_labels[goal.priority]}}
									</text>
									<text :class="[goal.finish && 'goal--removed']">{{goal.goal_name}}</text>
								</view>
								<view style="font-size: 0.7em; margin-top: 1em; color: #bbbbbb;">
									{{goal.start_time}} ~ {{goal.end_time}}
								</view>
							</view>
							<view v-if="goal.diff === goal.times">
								<view class="goal__finishIcon">
									<uni-icons type="star-filled" color="white"></uni-icons>
									完成
								</view>
							</view>
							<view v-else class="goal__daysPersist">
								<view class="goal__daysPersist__days">{{goal.times}} 天</view>
								<view style="font-size: 12px; margin-top: 4px;">已坚持</view>
							</view>
						</view>
						<view class="goal__progressBar" v-if="goal.diff > goal.times">
							<view class="goal__progressBar__progress" :style="{width: (goal.times / goal.diff)*100+'%'}"></view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
		<view class="unloginLogo" v-else>
			<uni-icons type="info" size="32"></uni-icons>
			<view>您未登陆</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import querystring from 'querystring'
	import { priority_colors, priority_labels } from '../../biz/priority.js'
	console.log('priority_colors', priority_colors)
	export default {
		onReady() {
			const that = this
			uni.getSystemInfo({
				success(res) {
					const headerEl = uni.createSelectorQuery().in(that).select('.header')
					headerEl.boundingClientRect(data => {
						that.scrollHeight = res.windowHeight - data.height
					}).exec()
				}
			})
		},
		onLoad() {
			this.getGoals()
		},
		onShow() {
			this.getGoals()
		},
		data() {
			return {
				goals: [],
				scrollHeight: 0,
				tabIndex: 'goals',
				tabList: [
					{
						title: '目标',
						key: 'goals'
					},
					{
						title: '统计',
						key: 'stat'
					}
				],
				priority_colors,
				priority_labels,
				date: dayjs().format('YYYY-MM-DD'),
				// record_ids: []
				finished_goal_ids: []
			}
		},
		computed: {
			// c_goals() {
			// 	const that = this
			// 	return this.goals.map(_ => ({
			// 		..._,
			// 		diff: dayjs(_.end_time).diff(_.start_time, 'd') + 1,
			// 		finish: that.finished_goal_ids.indexOf(_._id) !== -1
			// 	}))
			// },
			user() {
				return this.$store.state.user
			}
		},
		// watch: {
		// 	goals: {
		// 		handler(newVal, oldVal) {
		// 			const that = this
		// 			console.log('goals', newVal, oldVal)
		// 			this.goals = newVal.map(_ => ({
		// 				..._,
		// 				diff: dayjs(_.end_time).diff(_.start_time, 'd') + 1,
		// 				finish: that.finished_goal_ids.indexOf(_._id) !== -1
		// 			}))
		// 		},
		// 		deep: true
		// 	},
		// },
		methods: {
			onTabChange(key) {
				this.tabIndex = key
			},
			handleDate({ detail }) {
				this.date = detail.value
				// uniCloud.callFunction({
				// 	name: 'get_records',
				// 	data: {
				// 		date: this.date,
				// 		user_id: this.$store.state.user.id,
				// 	}
				// }).then(res => {
				// 	console.log('get_records', res)
				// })
				// this.getRecords()
				this.getGoals()
			},
			getRecords() {
				uniCloud.callFunction({
					name: 'get_records',
					data: {
						date: this.date,
						user_id: this.$store.state.user.id
					}
				}).then(({ result }) => {
					console.log('get records', result.data)
					this.finished_goal_ids = result.data.map(r => r.goal._id)
					console.log('finished_goal_ids', this.finished_goal_ids)
				})
			},
			getGoals() {
				console.log('local user', this.$store.state.user)
				if(this.$store.state.user) {
					// if(loading) {
						uni.showLoading()
					// }
					this.getRecords()
					uniCloud.callFunction({
						name: 'get_goal',
						data: {
							user_id: this.$store.state.user.id
						}
					}).then(({ result }) => {
						console.log('result.data', result.data)
						this.goals = result.data.map(_ => ({
							..._,
							diff: dayjs(_.end_time).diff(_.start_time, 'd') + 1,
							finish: this.finished_goal_ids.indexOf(_._id) !== -1,
						}))
						uni.hideLoading()
					})
				} else {
					this.goals = []
				}
			},
			addRecord(goal) {
				// const left_days = dayjs(goal.end_time).diff(goal.start_time, 'd') - goal.times
				const left_days = goal.diff - goal.times
				const p = querystring.stringify({
					id: goal._id,
					goal_name: goal.goal_name,
					goal_times: goal.times,
					update_time: goal.update_time,
					left_days
				})
				// if(left_days > 0) {
					uni.navigateTo({
						url: '../add-record/add-record?' + p
					})
				// } else {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		position: 'bottom',
				// 		title: '任务结束'
				// 	})
				// }
			},
			onIconClick() {
				uni.navigateTo({
					url: '../create-goal/create-goal'
				})
			},
			toReportChart() {
				// console.log('toReportChart', this.c_goals)
				// const p = querystring.stringify(this.c_goals)
				// console.log('pp', p)
				uni.navigateTo({
					url: '../report-chart/report-chart?goals=' + JSON.stringify(this.c_goals)
				})
			},
			removeGoal(id, goal_name) {
				const that = this
				uni.showModal({
					title: `删除目标：${goal_name}？`,
					success({ confirm }) {
						if(confirm) {
							console.log('删除目标', id)
							uni.showLoading()
							uniCloud.callFunction({
								name: 'remove_goal',
								data: {
									goal_id: id
								},
								success(res) {
									console.log('删除成功', res, that.$store.state.user.id)
									return uniCloud.callFunction({
										name:'get_goal',
										data: {
											user_id: that.$store.state.user.id
										},
										success({ result }) {
											console.log('get goals', result)
											that.goals = result.data
											uni.hideLoading()
											uni.showToast({
												title:'目标删除成功'
											})
										}
									})
								},
								fail(e) {
									console.log('删除目标失败', e)
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.priorityLabel {
		border-radius: 4px;
		margin-right: 6px;
		color: #FFFFFF;
		padding: 2px 6px;
	}
	.statBar {
		margin-top: 10px;
		font-size: 0.8em;
		z-index: 1;
		padding: 0px 20px;
		// background-color: red;
		display: flex;
		opacity: 0.4;
	}
	.statInfo {
		flex: 1;
	}
	.tabGroup {
		text-align: center;
	}
	.tab_button {
		margin-top: 10px;
		display: inline-block;
		padding: 10px 20px;
		color: $uni-text-color;
	}
	.active {
		/* background-color: blue; */
		color: $uni-color-primary;
		border-bottom: 2px solid $uni-color-primary;
	}
	.goal {
		width: 100%;
		margin: 10px;
	}
	.goal__board, .goal__progressBar {
		margin: 0px 10px;
	}
	.goal__progressBar__progress {
		/* background-color: blue; */
		background-color: #3F536E;
	}
	.goal__board {
		box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);
		background-color: white;
		display: flex;
		padding: 12px 24px;
	}
	.goal__progressBar {
		display: flex;
		margin-top: -1px;
		height: 1px;
	}
	.goal__goalName {
		// line-height: 51px;
		vertical-align: baseline;
		flex: 1;
	}
	.goal__daysPersist {
		color: rgba(0,0,0,0.3);
		text-align: center;
	}
	.goal__daysPersist__days {
		color: black;
		font-size: 1.2em;
		font-weight: bold;
		background-color: #3F536E;
		color: #FFFFFF;
		padding: 4px 12px;
		border-radius: $uni-border-radius-base;
	}
	.goal__finishIcon {
		background-color: $uni-color-warning;
		border-radius: $uni-border-radius-base;
		color: white;
		padding: 6px 12px;
	}
	.goal__disabled {
		color: $uni-text-color-disable;
	}
	.goal--removed {
		text-decoration: line-through;
		color: #777;
	}
	.swipeActionItem__rightOption {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
	}
	.swipeActionItem__rightOption-btn {
		padding: 0px 30px;
		margin: 10px 20px 10px 0px;
		// margin-right: 20px;
		vertical-align: center;
		line-height: 75px;
	}
	.unloginLogo {
		text-align: center;
		margin: 32px;
		opacity: 0.25;
	}
</style>
