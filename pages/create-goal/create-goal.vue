<template>
	<view>
		<uni-header showBackIcon="true">创建目标</uni-header>
		<form @submit="formSubmit">
			<input class="input" name='goal_name' v-model="goal_name" placeholder="目标名" />
			<!-- <label>
				<view>开始时间</view>
				<picker name='start_date' mode="date" @change="handleStartTime" :value="start_date">
					<input class="input" disabled="disabled" placeholder="请选择时间" :value="start_date" />
				</picker>
			</label>
			<label>
				<view>结束时间</view>
				<picker name='end_date' mode="date" @change="handleEndTime" :value="end_date">
					<input class="input" disabled="disabled" placeholder="请选择时间" v-model="end_date" />
				</picker>
			</label> -->
			<!-- <uni-time-ranger
				mode="date"
				:text="['开始日期', '结束日期']"
			/> -->
			<uni-time-ranger
				mode="time"
				:style="{'margin-top': '24px'}"
				:text="['开始时间', '结束时间']"
				@onChange="onTimeChange"
			/>
			
			<uni-checkbadge
				:style="{'margin-top': '36px'}"
				v-for="e of Object.entries(priority_levels)"
				:type="e[0]"
				:active="priority === e[0]"
				:text="e[1]"
				@onChange="onPriorityChange"
			/>
			
			<view style="display: flex; flex-direction: row; margin-top: 24px;">
				<UniCheckbox
					:checked="repeat"
					@onCheck="handleCheck"
					style="margin: 12px;"
					text="重复"
				/>
				<!-- <view style="background-color: red; flex: 1;"> -->
					<input
						name="repeat_times"
						v-if="repeat"
						class="number"
						placeholder="1" />
					<label v-if="repeat" class="unit">次/星期</label>
				<!-- </view> -->
			</view>
			
			<button :disabled="isDisabled" form-type="submit" type="primary" class="createGroup__createBtn">创建目标</button>
		</form>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import UniCheckbox from '../../components/uni-checkbox/uni-checkbox.vue'
	export default {
		components: {
			UniCheckbox
		},
		computed: {
			isDisabled() {
				return this.goal_name === '' || this.end_time === ''
			}
		},
		data() {
			return {
				goal_name: '',
				periodIndex: 0,
				period: ['天', '周', '月', '年'],
				start_time: dayjs().format('YYYY-MM-DD'),
				end_time: '',
				frequency: 1,
				priority: 'urgent',
				priority_levels: {
					urgent: '紧急',
					important: '重要',
					normal: '正常',
					success: '待定'
				},
				// checked: true,
				repeat: true,
				repeat_times: 0
			}
		},
		methods: {
			handleCheck() {
				this.repeat = !this.repeat
			},
			onTimeChange(value) {
				console.log('on change..', value)
				this.start_time = value[0]
				this.end_time = value[1]
			},
			onPriorityChange(priority) {
				console.log('onPriorityChange', priority)
				this.priority = priority
			},
			onRepeatTimeChange(e) {
				console.log('onRepeatTimeChange', e)
			},
			formSubmit(e) {
				const user = this.$store.state.user
				if(!user) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '您未登陆'
					})
					return
				}
				uni.showLoading({
					title:'创建目标'
				})
				const user_id = user.id
				// console.log('创建目标', this.$store.state.user)
				// console.log('form submit', e.detail.value)
				const {
					goal_name,
					// start_time,
					// end_time,
					period,
					frequency,
					repeat_times
				} = e.detail.value
				uniCloud.callFunction({
					name: 'create_goal',
					data: {
						create_by: user_id,
						goal_name,
						start_time: this.start_time,
						end_time: this.end_time,
						timestamp: new Date().getTime(),
						times: 0,
						priority: this.priority,
						repeat: this.repeat,
						repeat_times
					}
				}).then(res => {
					uniCloud.callFunction({
						name: 'get_goal',
						data: {
							user_id
						}
					}).then(({ result }) => {
						uni.hideLoading()
						uni.navigateBack()
					})
				})
			},
			handlePeriodChange(e) {
				this.periodIndex = e.detail.value
			},
			handleStartTime(e) {
				this.start_time = e.detail.value
			},
			handleEndTime(e) {
				this.end_time = e.detail.value
			},
			handleDate() {
				this.datePickerShow = true
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		padding: $page-padding;
	}
	label > view {
		margin-bottom: 12px;
		margin-top: 24px;
		font-weight: bold;
	}
	.form-item {
		padding-top: 15px;
		padding-bottom: 15px;
		margin-top: 15px;
		display: flex;
		text+* {
			flex: 1;
			margin-left: 10px;
		}
	}
	// input {
	// 	background-color: white;
	// 	padding: 12px;
	// 	text-indent: 5px;
	// }
	.createGroup__createBtn {
		margin-top: 24px;
	}
	.number {
		width: 50px;
		// background-color: red;
		padding: 6px;
		margin: 6px;
		height: 1em;
		text-align: right;
		justify-content: right;
	}
	.unit {
		// background-color: blue;
		height: 1em;
		padding: 6px;
		margin: 6px 6px 0px 0px;
	}
</style>
