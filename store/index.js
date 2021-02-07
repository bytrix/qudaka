import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	actions:{},
	mutations:{
		login(state, payload) {
			state.user = payload
		}
	},
	state:{
		scrollHeight: 0,
		user: null
	}
})
export default store