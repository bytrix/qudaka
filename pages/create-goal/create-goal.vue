<template>
	<view>
		<uni-header showBackIcon="true">创建目标</uni-header>
		<form @submit="formSubmit">
			<label>
				<view>你的目标是</view>
				<input name='goal_name' v-model="goal_name" placeholder="目标名" />
			</label>
			<label>
				<view>开始时间</view>
				<picker name='start_time' mode="date" @change="handleStartTime" :value="start_time">
					<input disabled="disabled" placeholder="请选择时间" :value="start_time" />
				</picker>
			</label>
			<label>
				<view>结束时间</view>
				<picker name='end_time' mode="date" @change="handleEndTime" :value="end_time">
					<input disabled="disabled" placeholder="请选择时间" v-model="end_time" />
				</picker>
			</label>
			<button :disabled="isDisabled" form-type="submit" type="primary" class="createGroup__createBtn">创建目标</button>
		</form>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import UniHeader from '../../components/uni-header.vue'
	export default {
		components: {
			UniHeader
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
			}
		},
		methods: {
			formSubmit(e) {
				uni.showLoading({
					title:'创建目标'
				})
				console.log('form submit', e.detail.value)
				const {
					goal_name,
					start_time,
					end_time,
					period,
					frequency
				} = e.detail.value
				uniCloud.callFunction({
					name: 'create_goal',
					data: {
						create_by: '1',
						goal_name,
						start_time,
						end_time,
						timestamp: new Date().getTime(),
						times: 0
					}
				}).then(res => {
					const pages = getCurrentPages()
					const prevPage = pages[0]
					uniCloud.callFunction({
						name: 'get_goal',
						data: {
							user_id: '1'
						}
					}).then(({ result }) => {
						prevPage.$vm.goals = result.data
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
	input {
		background-color: white;
		padding: 12px;
		text-indent: 5px;
	}
	.createGroup__createBtn {
		margin-top: 24px;
	}
</style>
