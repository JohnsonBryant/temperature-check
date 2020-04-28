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
    ...mapState(['isOnTest', 'IDS', 'equipments', 'TestTime', 'sensorCalibMode'])
  },
  mounted () {
    this.InitApp()
    this.initAppTitle()
  },
  methods: {
    ...mapActions([
      'setIsOnTestTask',
      'addToSearchedSensorIDsTask',
      'setEquiptmentsTask',
      'setSensorCalibSensorsTask'
    ]),
    InitApp () {
      this.$storage.get('config', (err, data) => {
        if (err) {
          console.error(err.message)
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
        this.parseSensorData(packbuf)
      } else {
        let DirectivePack = this.$Packet.DirectivePackParser.parse(packbuf)
        this.directiveAction(DirectivePack) // 处理各种数据指令事件
      }
    },
    parseSensorData (packbuf) {
      if (!this.sensorCalibMode) {
        try {
          let IDS = this.IDS
          // let AppConf = this.AppConf
          // 解析处理传感器数据
          let DataPack = this.$Packet.DataPackParser.parse(packbuf)
          if (IDS.includes(DataPack.deviceID)) {
            // 传感器ID在配置中， 对应测试中的某个仪器
            // let temp = parseFloat((DataPack.temp / 100.0).toFixed(2))
            // let humi = parseFloat((DataPack.humi / 100.0).toFixed(2))
            let temp = parseFloat(DataPack.temp.toFixed(2))
            let humi = parseFloat(DataPack.humi.toFixed(2))
            let batt = this.calcBatt(DataPack.batt)
            // 缓存在配置中的传感器的温湿度数据
            this.program.cache[DataPack.deviceID.toString()] = { temp, humi, batt }
            console.log(`${this.$myutil.nowtime()} 收到传感器ID:${DataPack.deviceID} 数据`)
          } else {
            // 传感器ID不在配置中， 推送未在配置中的传感器数据包到前端
            let dataNotInTest = `ID：${DataPack.deviceID}，温度：${parseFloat(DataPack.temp.toFixed(2))}，湿度：${parseFloat(DataPack.humi.toFixed(2))}`
            this.addMessage(`收到未在配置中传感器数据 ${dataNotInTest}`)
          }
        } catch (e) {
          console.log(e.message)
        }
      } else {
        let DataPack = this.$Packet.DataPackParser.parse(packbuf)
        let id = DataPack.deviceID
        let temp = parseFloat(DataPack.temp.toFixed(2))
        let batt = this.calcBatt(DataPack.batt)
        this.setSensorCalibSensorsTask({id, temp, batt})
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
          this.addToSearchedSensorIDsTask(pack.deviceID)
          if (pack.deviceType === 0x0A) {
            let buf = Buffer.from(pack.reserv)
            this.addMessage(`搜索到单温度传感器，ID：${pack.deviceID}，采样电阻值：${buf.readFloatLE(0)}`)
          } else if (pack.deviceType === 0x0B) {
            this.addMessage(`搜索到温湿度传感器，ID：${pack.deviceID}`)
          }
        },
        'A2': () => {
          // 修改单温度传感器电阻值应答
          let message = ``
          if (pack.reserv[0] === 0x00) {
            message = `传感器电阻值修改失败，传感器ID：${pack.deviceID}`
          } else if (pack.reserv[0] === 0x01) {
            message = `传感器电阻值修改成功，传感器ID：${pack.deviceID}`
          }
          this.addMessage(message)
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
            console.log(`收到一轮上报数据的开始标志`)
          } else if (key === 0x00) { // 主节点一轮上报数据的结束标志
            console.log(`收到一轮上报数据的结束标志`)
            this.updateEquipmentData() // 更新程序主缓存的数据， 计算更新检测数据
          }
        }
      }
      if (typeof commands[command] !== 'function') {
        this.addMessage('无效的数据指令字节 ' + command + ' !!!')
        return
      }
      commands[command]()
    },
    updateEquipmentData () {
      // 非测试状态，未启动测试、或采集完成后停止测试
      if (!this.isOnTest) {
        return
      }
      console.log(`${this.$myutil.nowtime()} update data`)
      let time = this.$myutil.nowtime()
      let data = this.program.cache
      let equipments = JSON.parse(JSON.stringify(this.equipments))
      // 测试仪器数据更新
      equipments.forEach((equipment, index, equipments) => {
        let IDS = [...equipment.data.IDS]
        if (IDS.every(id => data.hasOwnProperty(id))) { // 仪器挂载的传感器全部收到数据
          let sensorsdata = equipment.data
          if (sensorsdata['time'].length < equipment.config.count) {
            // 更新仪器下挂载的传感器的数据
            for (let i = 0; i < IDS.length; i++) {
              let id = IDS[i]
              sensorsdata[id]['temp'].push(data[id].temp).toFixed(2)
              sensorsdata[id]['humi'].push(data[id].humi).toFixed(2)
              sensorsdata[id]['batt'].push(data[id].batt)
            }
            // 更新计算仪器的 温度 / 湿度 的均匀度 evennessTemp、波动度 fluctuationTemp、上偏差 deviationTempSup、下偏差 deviationTempSub
            let allDataTemp = []
            let allDataHumi = []
            let tempConfig = equipment.config.temp
            let humiConfig = equipment.config.humi
            let roundtemp = IDS.map(id => sensorsdata[id]['temp'][sensorsdata[id]['temp'].length - 1])
            let roundhumi = IDS.map(id => sensorsdata[id]['humi'][sensorsdata[id]['humi'].length - 1])
            IDS.forEach((id) => {
              allDataTemp.push(...sensorsdata[id]['temp'])
              allDataHumi.push(...sensorsdata[id]['humi'])
            })
            sensorsdata['averageTemp'].push((this.max(roundtemp) - this.min(roundtemp)).toFixed(2))
            sensorsdata['averageHumi'].push((this.max(roundhumi) - this.min(roundhumi)).toFixed(2))
            sensorsdata['evennessTemp'] = (this.$myutil.Average(sensorsdata['averageTemp'])).toFixed(2)
            sensorsdata['evennessHumi'] = (this.$myutil.Average(sensorsdata['averageHumi'])).toFixed(2)
            sensorsdata['fluctuationTemp'] = (this.max(IDS.map(id => { return this.max(sensorsdata[id]['temp']) - this.min(sensorsdata[id]['temp']) })) / 2.0).toFixed(2)
            sensorsdata['fluctuationHumi'] = (this.max(IDS.map(id => { return this.max(sensorsdata[id]['humi']) - this.min(sensorsdata[id]['humi']) })) / 2.0).toFixed(2)
            sensorsdata['deviationTempSup'] = (this.max(allDataTemp) - tempConfig).toFixed(2)
            sensorsdata['deviationTempSub'] = (this.min(allDataTemp) - tempConfig).toFixed(2)
            sensorsdata['deviationHumiSup'] = (this.max(allDataHumi) - humiConfig).toFixed(2)
            sensorsdata['deviationHumiSub'] = (this.min(allDataHumi) - humiConfig).toFixed(2)
            sensorsdata['time'].push(time)
            // 构建导出数据格式
            // 导出数据的二维数组行定义
            let curDataCount = sensorsdata['time'].length
            let exportRow = {'temp': [], 'humi': []}
            // 添加当前采集包数到当前行
            exportRow.temp.push(curDataCount)
            exportRow.humi.push(curDataCount)
            // 添加传感器数据到当前行
            for (let i = 0; i < IDS.length; i++) {
              let id = IDS[i]
              exportRow.temp.push(data[id].temp)
              exportRow.humi.push(data[id].humi)
            }
            // 添加当前单次均匀度到当前行
            exportRow.temp.push(sensorsdata['averageTemp'][curDataCount - 1])
            exportRow.humi.push(sensorsdata['averageHumi'][curDataCount - 1])
            // 添加当前每列数据的最大值最小值
            let rowMax = {'temp': ['最大值'], 'humi': ['最大值']}
            let rowMin = {'temp': ['最小值'], 'humi': ['最小值']}
            for (let i = 0; i < IDS.length; i++) {
              let id = IDS[i]
              rowMax.temp.push(this.max(sensorsdata[id]['temp']))
              rowMin.temp.push(this.min(sensorsdata[id]['temp']))
              rowMax.humi.push(this.max(sensorsdata[id]['humi']))
              rowMin.humi.push(this.min(sensorsdata[id]['humi']))
            }
            rowMax.temp.push(this.max(sensorsdata['averageTemp']))
            rowMin.temp.push(this.min(sensorsdata['averageTemp']))
            rowMax.humi.push(this.max(sensorsdata['averageHumi']))
            rowMin.humi.push(this.min(sensorsdata['averageHumi']))
            equipment.exportData.temp.splice(equipment.exportData.temp.length - 2, 2)
            equipment.exportData.humi.splice(equipment.exportData.humi.length - 2, 2)
            equipment.exportData.temp.push(exportRow.temp)
            equipment.exportData.temp.push(rowMax.temp)
            equipment.exportData.temp.push(rowMin.temp)
            equipment.exportData.humi.push(exportRow.humi)
            equipment.exportData.humi.push(rowMax.humi)
            equipment.exportData.humi.push(rowMin.humi)
          }
        } else {
          // 仪器挂载的传感器未全部收到数据
          console.log(`仪器对应的传感器数据本次未全部收到`)
        }
      })
      // 更新数据到全局 store
      if (equipments.length > 0) {
        this.setEquiptmentsTask(equipments)
        this.$storage.set(this.TestTime, equipments, (error) => {
          if (error) {
            console.log(`存储测试数据的JSON文件发生错误，${error.message}`)
          }
        })
      }
      // 检查是否所有测试仪器数据均已采集完成，全部采集完成，则停止采集
      let isallAcqed = equipments.every((eq) => { return eq.config.count <= eq.data.time.length })
      if (isallAcqed && this.isOnTest) {
        let buf = Buffer.from('AA55' + 'CC' + '06' + '0B' + '00000000' + '000000', 'hex')
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            // reset store, variable
            this.setIsOnTestTask(false)
            this.addMessage('数据全部采集完成，停止采集！', 'success')
          } else {
            this.addMessage('数据采集完成停止，采集失败，请手动点击停止采集按钮！', 'warning')
          }
        })
      }
      this.program.cache = {}
    },
    calcBatt (value) {
      let AppConf = this.AppConf
      let batt = (value / 1000.0)
      if (batt >= AppConf.BatteryHigh) {
        batt = 100
      } else if (batt <= AppConf.BatteryLow) {
        batt = 0
      } else {
        batt = (batt - AppConf.BatteryLow) / (AppConf.BatteryHigh - AppConf.BatteryLow) * 100
      }
      batt = parseFloat(batt.toFixed(0))
      return batt
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType !== undefined ? 'info' : messageType
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
    },
    max (data) {
      if (data.length === 0) {
        return ''
      }
      return Math.max.apply(null, data)
    },
    min (data) {
      if (data.length === 0) {
        return ''
      }
      return Math.min.apply(null, data)
    }
  }
}
</script>

<style src="./css/style.css"></style>
