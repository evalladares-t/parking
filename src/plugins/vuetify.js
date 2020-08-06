import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify, {
  theme: {
    primary: '#415CB5',
    secondary: '#FF7888',
    accent: '#82B1FF',
    error: '#F33A65',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  options: {
    customProperties: true
  },
  iconfont: 'md'
})

export default new Vuetify({
})
