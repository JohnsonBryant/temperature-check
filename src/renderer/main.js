import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ECharts from 'vue-echarts'
import 'echarts-gl'
import storage from 'electron-json-storage'

import App from './App'
import router from './router.js'
import store from './store'

import sqliteDB from './utils/sqliteDB.js'
import { initConf } from './utils/conf.js'
import Packet from './utils/packetParser.js'
import myutil from './utils/myutil.js'

initConf()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios

Vue.component('v-chart', ECharts)

Vue.prototype.$sqliteDB = sqliteDB
Vue.prototype.$storage = storage
Vue.prototype.$port = { serialport: {} }
Vue.prototype.$Packet = Packet
Vue.prototype.$myutil = myutil

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
