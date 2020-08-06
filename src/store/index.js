import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('_token') || null,
    menu: JSON.parse(localStorage.getItem('_menu')) || null,
    user: JSON.parse(localStorage.getItem('_user')) || {},
    title: 'Parking'
  },
  mutations: {
    auth_success (state, data) {
      state.token = data.token
      state.menu = data.menu
      state.user = data.user
    },
    logout (state) {
      state.token = null
      state.menu = null
      state.user = {}
    }
  },
  actions: {
    login ({ commit }, data) {
      return new Promise((resolve) => {
        Vue.prototype.$api.defaults.headers.common.Authorization = 'Bearer ' + data.token
        localStorage.setItem('_token', data.token)
        localStorage.setItem('_menu', JSON.stringify(data.menu))
        localStorage.setItem('_user', JSON.stringify(data.user))
        commit('auth_success', data)
        resolve()
      })
    },
    logout ({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('_token')
        localStorage.removeItem('_user')
        localStorage.removeItem('_menu')
        delete Vue.prototype.$api.defaults.headers.common.Authorization
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token
  },
  modules: {
  }
})
