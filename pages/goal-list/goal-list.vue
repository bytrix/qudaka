<template>
	<view>
		<uni-header rightIcon='plusempty' :onIconClick="onIconClick">趣打卡</uni-header>
		<scroll-view scroll-y="true" :style="{height:scrollHeight+'px'}">
			<uni-swipe-action v-for="goal in c_goals">
				<uni-swipe-action-item>
					<template v-slot:right>
						<view class="swipeActionItem__rightOption">
							<view class="swipeActionItem__rightOption-btn">
								<uni-icons @click="editGoal" size='18' type="compose" style="color: #007AFF"></uni-icons>
							</view>
							<view class="swipeActionItem__rightOption-btn">
								<uni-icons @click="removeGoal(goal._id, goal.goal_name)" size='18' type="closeempty" style="color: #dd524d"></uni-icons>
							</view>
						</view>
					</template>
					<view class="goal" @click="addRecord(goal)">
						<view class="goal__board">
							<text class="goal__goalName">
								{{goal.goal_name}}
							</text>
							<view class="goal__daysPersist">
								<view class="goal__daysPersist__days">{{goal.times}} 天</view>
								<view style="font-size: 12px; margin-top: 4px;">已坚持</view>
							</view>
						</view>
						<!-- <view class="goal__progressBar" :style="{width: (goal.times / goal.diff)*100+'%'}"></view> -->
						<view class="goal__progressBar">
							<view class="goal__progressBar__progress" :style="{width: (goal.times / goal.diff)*100+'%'}"></view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
	</view>
</template>

<script>
	// import UniHeader from '../../components/uni-header.vue'
	import dayjs from 'dayjs'
	export default {
		components:{
			// UniHeader
		},
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
			uni.showLoading()
			uniCloud.callFunction({
				name: 'get_goal',
				data: {
					user_id: '1'
				}
			}).then(({ result }) => {
				this.goals = result.data
				uni.hideLoading()
			})
		},
		data() {
			return {
				goals: [],
				scrollHeight: 0
			}
		},
		computed: {
			c_goals() {
				return this.goals.map(_ => ({
					..._,
					diff: dayjs(_.end_time).diff(_.start_time, 'd')
				}))
			}
		},
		methods: {
			addRecord(goal) {
				console.log('add record', goal)
				uni.navigateTo({
					url:`../add-record/add-record?goal_id=${goal._id}&goal_name=${goal.goal_name}&goal_times=${goal.times}`
				})
			},
			onIconClick() {
				uni.navigateTo({
					url: '/pages/create-goal/create-goal'
				})
			},
			editGoal() {},
			removeGoal(id, goal_name) {
				// uni.showModal({
				// 	title: 'aa'
				// })
				const that = this
				uni.showModal({
					title: `删除目标：${goal_name}？`,
					success({ confirm }) {
						// console.log('ok...', res)
						if(confirm) {
							uni.showLoading()
							uniCloud.callFunction({
								name: 'remove_goal',
								data: id
							}).then(res => {
								return uniCloud.callFunction({
									name:'get_goal',
									data: {
										user_id: '1'
									}
								})
							}).then(({ result }) => {
								that.goals = result.data
								uni.hideLoading()
								uni.showToast({
									title:'目标删除成功'
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.goal {
		width: 100%;
		margin: 10px;
	}
	.goal__board, .goal__progressBar {
		margin: 0px 10px;
	}
	.goal__progressBar__progress {
		/* width: 100%; */
		background-color: blue;
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
		line-height: 51px;
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
		border-radius: 4px;
	}
	.swipeActionItem__rightOption {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
	}
	.swipeActionItem__rightOption-btn {
		padding: 0px 30px;
		margin: 10px 0px;
		vertical-align: center;
		line-height: 75px;
	}
</style>
