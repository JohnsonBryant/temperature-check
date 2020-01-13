'use strict'
import {mapState, mapActions} from 'vuex'
const SerialPort = require('serialport')

const port = {
  serialport: null,
  openPort: () => {
    this.serialport = new SerialPort(AppConf.SerialPortName, {
      baudRate: AppConf.BaudRate
    })
  }
}

export default port
