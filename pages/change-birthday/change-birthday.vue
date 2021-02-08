<template>
	<view>
		<uni-header showBackIcon rightIcon="checkmarkempty" @onIconClick="changeBirthday">修改生日</uni-header>
		<picker-view class="picker-view" :value="value" @change="handleBirthdayChange">
			<picker-view-column>
				<view v-for="year in years">{{year}}</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="month in months">{{month}}</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="day in days">{{day}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	import _ from 'lodash'
	import model from '../../sqlite_db/model/index.js'
	const years = _.range(1900, new Date().getFullYear())
	const months = _.range(1, 13)
	const days = _.range(1, 31)
	export default {
		data() {
			return {
				years,
				months,
				days,
				value: [years.length, 0, 0],
				user_id: ''
			}
		},
		onLoad({ user_id }) {
			this.user_id = user_id
		},
		methods: {
			handleBirthdayChange({ detail }) {
				this.value = detail.value
			},
			changeBirthday() {
				uni.showLoading()
				const year = this.years[this.value[0]]
				const month = this.months[this.value[1]]
				const day = this.days[this.value[2]]
				const birthday = `${year}-${month}-${day}`
				console.log('birthday', birthday, this.user_id)
				uniCloud.callFunction({
					name: 'change_user_birthday',
					data: {
						user_id: this.user_id,
						birthday
					}
				}).then((res) => {
					console.log('生日修改成功', res)
					return model.user.update({
						birthday
					}, {
						id: this.user_id
					})
				}).then(() => {
					this.$store.commit('user', {
						birthday
					})
					uni.hideLoading()
					uni.switchTab({
						url: '../my/my'
					})
				})
			}
		}
	}
</script>

<style>
.picker-view {
	height: 200px;
}
</style>
