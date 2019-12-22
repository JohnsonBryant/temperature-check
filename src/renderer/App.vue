<template>
  <div id="app">
    <el-button
    type="primary" round
    @click="OpenSerialPort">{{this.serialportIsOpen ? '关闭串口' : '打开串口' }}</el-button>
    <router-view></router-view>
  </div>
</template>

<script>
const SerialPort = require('serialport')

export default {
  name: 'electron-vue',
  data () {
    return {
      serialportIsOpen: false
    }
  },
  mounted () {
    console.log(this.serialport)
  },
  methods: {
    OpenSerialPort () {
      this.InitSerialPort()
    },
    InitSerialPort () {
      if (this.serialport === null) {
        this.serialport = new SerialPort('COM9', {
          baudRate: 115200
        })
        // 打开串口
        this.serialport.open(() => {
          // serialport.write(`Open serialport ${Config.serialportName} successed!`)
        })
        // 串口错误
        this.serialport.on('error', (message) => {
          console.error(message)
        })
        // 串口数据接收
        this.serialport.on('data', (data) => {
          if (!data) {
            return
          }
          console.log(data)
        })
        console.log(this.serialport)
        this.serialportIsOpen = true
      } else {
        this.serialport.close()
        this.serialport = null
        this.serialportIsOpen = false
      }
    }
  }
}
</script>

<style>
  /* CSS */
</style>
