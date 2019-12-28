<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
const SerialPort = require('serialport')

export default {
  name: 'electron-vue',
  data () {
    return {
      AppConf: {
        SerialPortName: String,
        BaudRate: 115200,
        BatteryHigh: Number,
        BatteryLow: Number
      },
      serialportIsOpen: false,
      program: {
        buf: Buffer.alloc(0),
        cache: {}
      }
    }
  },
  computed: {
    ...mapState(['isOnTest'])
  },
  mounted () {
    this.InitApp()
    this.initAppTitle()
  },
  methods: {
    ...mapActions(['setIsOnTestTask']),
    InitApp () {
      this.$storage.get('config', (err, data) => {
        if (err) {
          this.addMessage(err)
          return
        }
        this.AppConf = data
        this.InitSerialPort()
      })
    },
    InitSerialPort () {
      let AppConf = this.AppConf
      this.$port.serialport = new SerialPort(AppConf.SerialPortName, {
        baudRate: AppConf.BaudRate
      })
      // 打开串口
      this.$port.serialport.open(() => {
        // serialport.write(`Open serialport ${Config.serialportName} successed!`)
      })
      // 串口错误
      this.$port.serialport.on('error', (message) => {
        console.error(message)
      })
      // 串口数据接收
      this.$port.serialport.on('data', (data) => {
        if (!data) {
          return
        }
        let bufLen = this.program.buf.length + data.length
        this.program.buf = Buffer.concat([this.program.buf, data], bufLen)
        this.processbuf()
      })
      this.serialportIsOpen = true
    },
    processbuf () {
      while (this.program.buf.length > this.$Packet.minlen) {
        if (this.program.buf[0] === 0xAA && this.program.buf[1] === 0x55) {
          let packlen = this.program.buf.readUInt8(3) + this.$Packet.minlen
          if (this.program.buf.length < packlen) {
            break
          }
          let bufPack = Buffer.alloc(packlen)
          this.program.buf.copy(bufPack, 0, 0, packlen)
          this.parseData(bufPack)

          let bufremain = Buffer.alloc(this.program.buf.length - packlen)
          this.program.buf.copy(bufremain, 0, packlen, this.program.buf.length)
          this.program.buf = bufremain
        } else {
          let bufremain = Buffer.alloc(this.program.buf.length - 1)
          this.program.buf.copy(bufremain, 0, 1, this.program.buf.length)
          this.program.buf = bufremain
        }
      }
    },
    parseData (packbuf) {
      if (packbuf.readUInt8(2) === 0xD1) {
        // if (!this.$store.state.MainState.isOnTest) { // 系统未在测试状态
        //   this.addMessage('系统未在测试状态，收到: ' + `${packbuf.toString('hex')}`)
        //   return
        // }
        this.parseSensorData(packbuf)
      } else {
        let DirectivePack = this.$Packet.DirectivePackParser.parse(packbuf)
        this.directiveAction(DirectivePack) // 处理各种数据指令事件
      }
    },
    parseSensorData (packbuf) {
      try {
        let IDS = this.$store.state.MainState.IDS
        let AppConf = this.AppConf
        // 解析处理传感器数据
        let DataPack = this.$Packet.DataPackParser.parse(packbuf)
        this.addMessage(`${this.myutil.nowtime()} 收到传感器数据`)
        if (IDS.includes(DataPack.deviceID)) {
          // 传感器ID在配置中， 对应测试中的某个仪器
          let temp = (DataPack.temp / 100.0).toFixed(2)
          let humi = (DataPack.humi / 100.0).toFixed(2)
          let batt = (DataPack.batt / 1000.0)
          if (batt >= AppConf.BatteryHigh) {
            batt = 100
          } else if (batt <= AppConf.BatteryLow) {
            batt = 0
          } else {
            batt = (batt - AppConf.BatteryLow) / (AppConf.BatteryHigh - AppConf.BatteryLow) * 100
          }
          batt = batt.toFixed(0)
          // 缓存在配置中的传感器的温湿度数据
          this.program.cache[DataPack.deviceID.toString()] = { temp, humi, batt }
          console.log({ temp, humi, batt })
          this.addMessage(`收到传感器数据`)
        } else {
          // 传感器ID不在配置中， 推送未在配置中的传感器数据包到前端
          this.addMessage(`${this.myutil.nowtime()} 传感器数据不在配置中 `)
        }
      } catch (e) {
        this.addMessage(e)
      }
    },
    directiveAction (pack) {
      let command = pack.command.toString(16).toUpperCase()
      let commands = {
        'A0': () => {
          // 成功修改传感器 ID，推送数据对象到前端
          this.addMessage(`收到修改传感器ID应答`)
        },
        'A1': () => {
          // 搜索传感器应答数据，推送数据对象到前端，可获取到单个在线的传感器ID号
          this.addMessage(`收到搜索传感器应答`)
        },
        'CE': () => {
          this.addMessage(`收到启动应答`)
        },
        'CC': () => {
          this.addMessage(`收到停止应答`)
        },
        'CF': () => {
          // 主节点一轮上报数据到应用端的开始 / 结束信号
          let key = pack.reserv[0]
          if (key === 0x01) { // 主节点一轮上报数据的开始标志
            this.addMessage(`收到一轮上报数据的开始标志`)
          } else if (key === 0x00) { // 主节点一轮上报数据的结束标志
            // updateEquipmentData() // 更新程序主缓存的数据， 计算更新检测数据
            this.addMessage(`收到一轮上报数据的结束标志`)
          }
          this.program.cache = {}
        }
      }
      if (typeof commands[command] !== 'function') {
        this.addMessage('无效的数据指令字节 ' + command + ' !!!')
        return
      }
      commands[command]()
    },
    updateEquipmentData () {
      // if (!this.$store.state.MainState.isOnTest) { // 系统未在测试状态
      //   return
      // }
      this.addMessage(`${this.myutil.nowtime()} update data`)
      let time = this.myutil.nowtime()
      let data = this.program.cache
      let equipments = JSON.parse(JSON.stringify(this.$store.state.MainState.equipments))
      equipments.forEach((equipment, index, equipments) => {
        let IDS = equipment.data.IDS
        if (IDS.every(id => data.hasOwnProperty(id))) { // 仪器挂载的传感器全部收到数据
          // 更新仪器下挂载的传感器的数据
          IDS.forEach((id) => {
            equipment.data[id]['temp'].push(data[id].temp)
            equipment.data[id]['humi'].push(data[id].humi)
            equipment.data[id]['batt'].push(data[id].batt)
          })
          // 计算更新仪器的 温度 / 湿度 的均匀度、波动度、偏差
          let tempConfig = equipment.config.temp
          let humiConfig = equipment.config.humi
          let centerID = equipment.config.centerID
          let centerSensor = equipment.data[centerID]
          let evennessTemp
          let fluctuationTemp
          let deviationTemp
          let evennessHumi
          let fluctuationHumi
          let deviationHumi
          let arrtemp = []
          let arrhumi = []
          for (let i = 0; i < centerSensor['temp'].length; i++) {
            let roundtemp = IDS.map(id => equipment.data[id]['temp'][i])
            let roundhumi = IDS.map(id => equipment.data[id]['humi'][i])
            arrtemp.push(this.myutil.Max(roundtemp) - this.myutil.Min(roundtemp))
            arrhumi.push(this.myutil.Max(roundhumi) - this.myutil.Min(roundhumi))
          }
          evennessTemp = this.myutil.Average(arrtemp)
          fluctuationTemp = centerSensor['temp'].length === 1 ? 0 : (this.myutil.Max(centerSensor['temp']) - this.myutil.Min(centerSensor['temp'])) / 2
          deviationTemp = tempConfig - this.myutil.Average(centerSensor['temp'])
          evennessHumi = this.myutil.Average(arrhumi)
          fluctuationHumi = centerSensor['humi'].length === 1 ? 0 : (this.myutil.Max(centerSensor['humi']) - this.myutil.Min(centerSensor['humi'])) / 2
          deviationHumi = humiConfig - this.myutil.Average(centerSensor['humi'])
          equipment.data['evennessTemp'].push(evennessTemp.toFixed(2))
          equipment.data['fluctuationTemp'].push(fluctuationTemp.toFixed(2))
          equipment.data['deviationTemp'].push(deviationTemp.toFixed(2))
          equipment.data['evennessHumi'].push(evennessHumi.toFixed(2))
          equipment.data['fluctuationHumi'].push(fluctuationHumi.toFixed(2))
          equipment.data['deviationHumi'].push(deviationHumi.toFixed(2))
          equipment.data['time'].push(time)
          // 更新数据到前端, 当前逻辑未实现
        } else {
          // 仪器挂载的传感器未全部收到数据
          this.addMessage(`仪器对应的传感器数据本次未全部收到`)
        }
      })
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType === undefined ? 'info' : messageType
      })
    },
    initAppTitle () {
      this.$storage.get('appConfig', (err, data) => {
        if (err) {
          this.addMessage(err)
          return
        }
        document.getElementsByTagName('title')[0].text = data.title
      })
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
  /* CSS */
#app{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.top{
  min-height: 60px;
  flex-grow: 0;
  background-color: gainsboro;
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
}

.main{
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
}

.top-item{
  align-self: center;
}
</style>
