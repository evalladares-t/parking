import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueAxios from 'vue-axios'
import axios from 'axios'
import vuetify from './plugins/vuetify'

import confirmModal from '@/components/modal/confirm.modal.vue'

require('./assets/sass/kt.sass')

Vue.use(VueAxios, axios)

Vue.component('confirm-modal', confirmModal)

Vue.prototype.$api = axios.create({
  baseURL: 'http://localhost:3000/api/v1.0',
  headers: {
    common: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  withCredentials: false
})
const token = localStorage.getItem('_token')
if (token) {
  Vue.prototype.$api.defaults.headers.common.Authorization = 'Bearer ' + token
}

Vue.prototype.$pad = function (num) {
  var norm = Math.floor(Math.abs(num))
  return (norm < 10 ? '0' : '') + norm
}

Vue.prototype.$rules = {
  required: (v) => !!v || 'Este campo es requerido'
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
