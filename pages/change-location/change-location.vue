<template>
	<view>
		<uni-header showBackIcon rightIcon="checkmarkempty" @onIconClick="onIconClick">选择地区</uni-header>
		<picker-view
			:value="[this.provinceIndex]"
			indicator-style="height: 30px"
			class="picker-view"
			:style="{height: this.$store.state.scrollHeight + 'px'}"
			@change="handleProvinceChange">
			<picker-view-column>
				<view v-for="privince in provinces" :key="privince.code">{{privince.name}}</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="city in cities" :key="city.code">{{city.name}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	import model from '../../sqlite_db/model/index.js'
	export default {
		data() {
			return {
				provinceIndex: 0,
				cityIndex: 0,
				provinces: [],
				cities: []
			}
		},
		methods: {
			get_cities(code) {
				return uniCloud.callFunction({
					name: 'get_china_city',
					data: {
						parent_code: code
					}
				}).then(({ result }) => {
					const cities = result.data
					this.cities = cities
				})
			},
			handleProvinceChange({ detail }) {
				const value = detail.value
				this.provinceIndex = value[0]
				if(value.length === 2) {
					this.cityIndex = value[1]
				}
				const province = this.provinces[this.provinceIndex]
				this.get_cities(province.code)
			},
			onIconClick() {
				uni.showLoading()
				const province = this.provinces[this.provinceIndex]
				const city = this.cities[this.cityIndex]
				console.log('onIconClick', province.name, city.name)
				const location = `${province.name}, ${city.name}`
				uniCloud.callFunction({
					name: 'change_user_location',
					data: {
						user_id: this.user_id,
						location: location
					}
				}).then(() => {
					console.log('地址更新成功', model)
					return model.user.update({
						location
					}, {
						id: this.user_id
					})
				}).then(() => {
					uni.hideLoading()
					this.$store.commit('user', {
						location
					})
					console.log('本地数据location更新成功')
					uni.switchTab({
						url: '../my/my'
					})
				})
			}
		},
		onLoad({ user_id }) {
			uni.showLoading()
			this.user_id = user_id
			uniCloud.callFunction({
				name: 'get_china_province'
			}).then(({ result }) => {
				console.log('get_china_province result', result)
				this.provinces = result.data
				this.provinceIndex = this.provinces.length / 2
				const province = this.provinces[this.provinceIndex]
				this.get_cities(province.code).then(() => {
					uni.hideLoading()
				})
			})
		}
	}
</script>

<style>
	.picker-view {
		width: 100%;
	}
</style>
