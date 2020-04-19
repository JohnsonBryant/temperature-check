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

import sqliteDB from './utils/sqlitedb1.js'
import { initConf } from './utils/conf.js'
import Packet from './utils/packetParser.js'
import myutil from './utils/myutil.js'

const { app, dialog } = require('electron').remote
const { ipcRenderer } = require('electron')

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

// 执行完程序配置文件初始化检查后， 进行Vue根实例的初始化挂载，程序初始化。
initConf.then((result) => {
  console.log(result)
  /* eslint-disable no-new */
  new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
  }).$mount('#app')
})
  .catch((error) => {
    console.log(error)
    dialog.showMessageBox({
      type: 'error',
      title: '初始化错误',
      message: '程序启动遇到错误，请关闭后重新启动！'
    })
    app.exit()
  })

ipcRenderer.on('applictionExit', (event, args) => {
  let buf = Buffer.from('AA55' + 'CC' + '06' + '0B' + '00000000' + '000000', 'hex')
  Vue.prototype.$port.serialport.write(buf, (err) => {
    if (!err) {
      console.log(`停止测试。`)
    }
  })
})
