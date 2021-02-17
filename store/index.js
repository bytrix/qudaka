import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
Vue.use(Vuex)
const store = new Vuex.Store({
	actions:{},
	mutations:{
		user(state, payload) {
			state.user = _.assign(state.user, payload)
		},
		scrollHeight(state, payload) {
			state.scrollHeight = payload
		}
	},
	state:{
		scrollHeight: 0,
		user: null
	}
})
export default store