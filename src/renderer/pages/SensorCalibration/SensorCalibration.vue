<template>
    <div class='sensor-calib main-page'>
        <div class="main-title top-bar">
            <span class="item">传感器标定页</span>
            <div class="item right">
                <el-button @click="enterCalibMode"
                :type="!sensorCalibMode ? 'primary': 'warning'" 
                :disabled="isOnTest">{{!sensorCalibMode ? '进入标定模式' : '退出标定模式'}}</el-button>
            </div>
        </div>

        <div class="main-page-container">
            <div class="wraper">
                <el-form :model="sensorConfig" label-width="120px">
                    <h4>传感器标定参数</h4>
                    <el-form-item label="传感器编号">
                        <el-input type="text" v-model.number="sensorConfig.id"></el-input>
                    </el-form-item>
                    <el-form-item label="标准最大值">
                        <el-input type="text" v-model.trim="sensorConfig.baseHigh"></el-input>
                    </el-form-item>
                    <el-form-item label="标准最小值">
                        <el-input type="text" v-model.trim="sensorConfig.baseLow"></el-input>
                    </el-form-item>
                    <el-form-item label="实测最大值">
                        <el-input type="text" v-model.trim="sensorConfig.realHigh"></el-input>
                    </el-form-item>
                    <el-form-item label="实测最小值">
                        <el-input type="text" v-model.trim="sensorConfig.realLow"></el-input>
                    </el-form-item>
                </el-form>
                <div class="sensors">
                    <div class="buttons">
                        <el-button @click="writeCalibToSensor" :disabled="!sensorCalibMode" type="primary">写入标定</el-button>
                    </div>
                    <h4>标定传感器实时数据</h4>
                    <template v-if="sensorCalibSensors.length > 0">
                        <div class="sensor" v-for="(sensor, index) in sensorCalibSensors" :key="index">
                            <span>传感器编号：{{ sensor.id }}</span>
                            <span>温度：{{ sensor.temp }} ℃</span>
                            <span>电量：{{ sensor.batt }} %</span>
                        </div>
                    </template>
                    <template v-else>
                        <div>
                            暂无数据...
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SensorCalib',
  data () {
    return {
      sensorConfig: {
        id: 1,
        baseLow: -50,
        baseHigh: 150,
        realLow: -50,
        realHigh: 150
      }
    }
  },
  computed: {
    ...mapState(['isOnTest', 'sensorCalibMode', 'sensorCalibSensors'])
  },
  methods: {
    ...mapActions(['setSensorCalibModeTask']),
    enterCalibMode () {
      // 发送指令到主节点
      if (!this.sensorCalibMode) {
        this.start().then((result) => {
          let msg = result === 'success' ? '进入标定模式成功！' : '串口写入错误，进入标定模式失败！'
          this.addMessage(msg, result)
          let sensorCalibMode = result === 'success' ? true : this.sensorCalibMode
          this.setSensorCalibModeTask(sensorCalibMode)
        })
      } else {
        this.stop().then((result) => {
          let msg = result === 'success' ? '退出标定模式成功！' : '串口写入错误，退出标定模式失败，请重新操作！！！'
          this.addMessage(msg, result)
          let sensorCalibMode = result === 'success' ? false : this.sensorCalibMode
          this.setSensorCalibModeTask(sensorCalibMode)
        })
      }
    },
    start () {
      return new Promise((resolve, reject) => {
        let bufstr = 'AA55' + 'CE' + '06' + '0B' + '00' + Number(1).toString(16).padStart(4, '0') + '0100' + '0000'
        let buf = Buffer.from(bufstr, 'hex')
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            resolve('success')
          } else {
            resolve('warning')
          }
        })
      })
    },
    stop () {
      return new Promise((resolve, reject) => {
        let buf = Buffer.from('AA55' + 'CC' + '06' + '0B' + '00000000' + '000000', 'hex')
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            resolve('success')
          } else {
            resolve('warning')
          }
        })
      })
    },
    writeCalibToSensor () {
      let sensorConfig = this.sensorConfig
      if ([sensorConfig.id, sensorConfig.realHigh, sensorConfig.realLow, sensorConfig.baseHigh, sensorConfig.baseLow].find(v => v === '') !== undefined) {
        this.addMessage('标定参数输入错误！', 'error')
        return
      }
      // 数据校验
      let id = sensorConfig.id
      let realHigh = parseFloat(sensorConfig.realHigh)
      let realLow = parseFloat(sensorConfig.realLow)
      let baseHigh = parseFloat(sensorConfig.baseHigh)
      let baseLow = parseFloat(sensorConfig.baseLow)
      if ([id, realHigh, realLow, baseHigh, baseLow].find(v => this.$myutil.isValidNumber(v) === false) !== undefined) {
        this.addMessage('标定参数输入错误！', 'error')
        return
      }
      // 计算系数， 并下发系数到设备
      let a = (baseHigh - baseLow) / (realHigh - realLow)
      let b = baseHigh - a * realHigh
      console.log(realHigh, realLow, baseHigh, baseLow, a, b)
      let buf = Buffer.from('AA55' + 'A2' + '06' + '0A' + id.toString(16).padStart(2, '0') + this.float2hexstringLE(a) + '0000', 'hex')
      this.writeData(buf).then((result) => {
        let that = this
        setTimeout(() => {
          let buf = Buffer.from('AA55' + 'A3' + '06' + '0A' + id.toString(16).padStart(2, '0') + that.float2hexstringLE(b) + '0000', 'hex')
          that.writeData(buf).then((result) => {
            let msg = result === 'success' ? '标定数据写入成功！' : '串口写入错误，标定数据失败！'
            that.addMessage(msg, result)
          })
        }, 500)
      })
    },
    writeData (buf) {
      return new Promise((resolve, reject) => {
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            resolve('success')
          } else {
            resolve('warning')
          }
        })
      })
    },
    float2hexstringLE (value) {
      let buffer = Buffer.alloc(4)
      buffer.writeFloatLE(value)
      return buffer.toString('hex')
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType !== undefined ? messageType : 'info'
      })
    }
  }
}
</script>