<template>
	<view>
		<uni-header rightIcon='plusempty' @onIconClick="onIconClick">趣打卡</uni-header>
		<view v-if="user" class="statBar" @click="toReportChart">
			<text class="statInfo">
				{{c_goals.length}}项目标，已完成{{c_goals.filter(_ => _.times === _.diff).length}}项
			</text>
			<view>
				查看统计
				<uni-icons type="forward" size="12"></uni-icons>
			</view>
		</view>
		<scroll-view v-if="user" scroll-y="true" :style="{height:scrollHeight+'px'}">
			<uni-swipe-action v-for="goal in c_goals">
				<uni-swipe-action-item>
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
						<view class="goal__board">
							<view :class="['goal__goalName', {'goal__disabled':goal.diff === goal.times}]">
								<view>{{goal.goal_name}}</view>
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
			this.getGoals(true)
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
				]
			}
		},
		computed: {
			c_goals() {
				return this.goals.map(_ => ({
					..._,
					diff: dayjs(_.end_time).diff(_.start_time, 'd') + 1
				}))
			},
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			onTabChange(key) {
				this.tabIndex = key
			},
			getGoals(loading = false) {
				console.log('local user', this.$store.state.user)
				if(this.$store.state.user) {
					if(loading) {
						uni.showLoading()
					}
					uniCloud.callFunction({
						name: 'get_goal',
						data: {
							user_id: this.$store.state.user.id
						}
					}).then(({ result }) => {
						console.log('result.data', result.data)
						this.goals = result.data
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
				if(left_days > 0) {
					uni.navigateTo({
						url: '../add-record/add-record?' + p
					})
				} else {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '目标已完成'
					})
				}
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
		box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
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
