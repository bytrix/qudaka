import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	actions:{},
	mutations:{},
	state:{
		scrollHeight: 0,
		user: {
			username: '',
			avatar: ''
		}
	}
})
export default store