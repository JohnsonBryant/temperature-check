<template>
  <div class="test-config main-page">
    <!-- 测试管理页头，工作周期输入框、控制按钮 -->
    <div class="main-page-title top-bar">
      <span class="top-bar-item">测试管理页</span>
      <el-form :inline="true">
        <!-- <div class="top-bar-item"> -->
          <el-form-item label="工作周期s：">
            <el-input
              class="cycle-input" placeholder="请输入工作周期s" v-model="localeCycle"
              :disabled="isOnTest">
            </el-input>
          </el-form-item>
        <!-- </div> -->
        <!-- <div class="top-bar-item"> -->
          <el-form-item>
            <el-switch
              v-model="localeIsSendding"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="周期获取数据"
              inactive-text="仅监测数据"
              :disabled="isOnTest"
            ></el-switch>
          </el-form-item>
        <!-- </div> -->
      </el-form>
      <div class="top-bar-item">
        <el-button
          @click="setAllEquipment"
          type="success" round
          :disabled="isOnTest"
        >一键配置</el-button>
        <el-button
          @click="startTest" 
          type="success" round
          :disabled="isOnTest"
        >启动测试</el-button>
      </div>
    </div>
    <!-- 测试仪器配置区块，展示所有测试仪器配置信息 -->
    <div class="main-page-container">
      <div v-if="getCurrentState" class="warn-text">
        <!-- 未处在测试状态，且不是从设备管理页路由并传递参数到本页时显示 -->
        <h4>当前系统未处在测试状态，如需要进行测试，请切换到设备管理页，选择测试设备，启动测试！</h4>
      </div>
      <template v-for="(item,index) in testDeviceInfo">
        <template v-if="item.device.detectProperty === '温湿度'">
          <test-config-item-th
            :key="index"
            :device="item.device"
            :config="item.config"
          />
        </template>
        <template v-else-if="item.device.detectProperty === '温度'">
          <test-config-item-temp
            :key="index"
            :device="item.device"
            :config="item.config"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import Vue from 'vue'
import moment from 'moment'
import TestConfigItemTH from './TestConfigItemTH'
import TestConfigItemTemp from './TestConfigItemTemp'

export default {
  name: 'test-config',
  components: {
    'test-config-item-th': TestConfigItemTH,
    'test-config-item-temp': TestConfigItemTemp
  },
  data () {
    return {
      localeCycle: '',
      localeIsSendding: false,
      testTemplate: {
        cycle: '',
        temp: '',
        humi: '',
        IDS: '',
        isSendding: true,
        count: 15
      },
      testDeviceInfo: []
    }
  },
  beforeMount () {
    this.initTestDeviceInfo() // 使用 store 变量初始化页面
    this.InitTestTemplate() // 获取测试模板信息，并初始化 data.testTemplate
  },
  computed: {
    ...mapState([
      'isOnTest',
      'cycle',
      'isSendding',
      'equipments',
      'selectedEquipments'
    ]),
    getCurrentState () {
      return (this.testDeviceInfo.length === 0) && !this.isOnTest
    }
  },
  methods: {
    ...mapActions(['clearAllSelectedEquipmentsTask',
      'setIsOnTestTask',
      'setCycleTask',
      'setIsSenddingTask',
      'setIDSTask',
      'setEquiptmentsTask',
      'resetEquipmentsTask',
      'setTestTimeTask'
    ]),
    InitTestTemplate () {
      this.$storage.get('testTemplate', (err, data) => {
        if (err) {
          this.addMessage(`获取测试模板错误，请重启程序！`, 'warning')
          return
        }
        this.setData(this.testTemplate, data)
      })
    },
    initTestDeviceInfo () {
      if (this.isOnTest) {
        // 检查当前系统为测试状态，则使用测试数据进行初始化
        this.localeCycle = this.cycle
        this.localeIsSendding = this.isSendding
        let equipments = JSON.parse(JSON.stringify(this.equipments))
        equipments.forEach((ele) => {
          ele.config.IDS = ele.config.IDS.join(',')
        })
        this.testDeviceInfo.splice(0, this.testDeviceInfo.length, ...equipments)
      } else {
        // 检查当前是否为选择了测试仪器，并点击了进入测试按钮， 是，则使用已选择仪器数组作为数据源进行初始化
        let equipments = JSON.parse(JSON.stringify(this.selectedEquipments))
        let testDeviceInfo = equipments.map(ele => {
          let config = {}
          if (ele.detectProperty === '温湿度') {
            config = {
              config: {
                temp: '',
                humi: '',
                IDS: '',
                count: ''
              }
            }
          } else if (ele.detectProperty === '温度') {
            config = {
              config: {
                temp: '',
                IDS: '',
                count: ''
              }
            }
          }
          return Object.assign({device: ele}, config)
        })
        this.testDeviceInfo.splice(0, this.testDeviceInfo.length, ...testDeviceInfo)
      }
    },
    setAllEquipment () {
      // 使用预先配置的测试模板信息，一键配置所有测试仪器的温度示值、湿度示值、工作周期信息
      let testTemplate = this.testTemplate
      this.localeCycle = testTemplate.cycle
      this.localeIsSendding = testTemplate.isSendding
      this.testDeviceInfo.forEach((testDevice, index) => {
        if (testDevice.device.detectProperty === '温湿度') {
          testDevice.config.temp = testTemplate.temp
          testDevice.config.humi = testTemplate.humi
          testDevice.config.IDS = testTemplate.IDS
          testDevice.config.count = testTemplate.count
        } else if (testDevice.device.detectProperty === '温度') {
          testDevice.config.temp = testTemplate.temp
          testDevice.config.IDS = testTemplate.IDS
          testDevice.config.count = testTemplate.count
        }
      })
    },
    startTest () {
      // 检查当前是否在 测试状态
      if (this.isOnTest) {
        this.addMessage('当前系统处于测试转态，请勿重复操作！', 'warning')
        return
      }
      let cycle = parseInt(this.localeCycle)
      let isSendding = this.localeIsSendding
      let selectedEquipments = JSON.parse(JSON.stringify(this.testDeviceInfo)) // 深拷贝 选择的测试仪器信息数组， 用于检查及传递给 store 中对应的 miutation。
      let devicesTemp = selectedEquipments.map((item) => {
        return item.device.company + item.device.em + item.device.deviceName + item.device.deviceType + item.device.deviceID
      })
      let IDS = []
      // 检查是否具备启动测试条件
      // 周期参数错误
      if (!this.$myutil.isPositiveInteger(cycle)) {
        this.addMessage('周期错误，周期必须为数值，且应大于或等于1 ！', 'warning')
        return
      }
      // 测试仪器信息错误，或测试仪器为空
      if (!Array.isArray(selectedEquipments) || selectedEquipments.length === 0) {
        this.addMessage('空仪器错误，必须选择一个测试仪器并配置完成后，才能进行测试 ！', 'warning')
        return
      }
      // 测试仪器信息检查
      // 检查到重复的两个仪器
      if (devicesTemp.some((item, index, arr) => arr.indexOf(item) !== arr.lastIndexOf(item))) {
        this.addMessage('仪器重复错误，不允许在同一次测试中出现两个相同的仪器 ！', 'warning')
        return
      }
      // 测试仪器下挂载的其他传感器ID的转换及检查
      selectedEquipments.forEach((ele) => {
        let s, ids
        s = ele.config.IDS.trim() === '' ? '' : ele.config.IDS.replace(/,|，/g, ',')
        ids = s === '' ? [] : s.split(',').map(id => parseInt(id))
        ele.config.IDS = ids
        IDS.push(...ids)
      })
      if (IDS.some((item) => !this.$myutil.isInteger(item) || (item > 255 || item < 0))) {
        this.addMessage('仪器挂载的传感器ID输入有错误，请检查后重试 ！', 'warning')
        return
      }
      // 检查到重复传感器ID
      if (IDS.some((item, index, arr) => arr.indexOf(item) !== arr.lastIndexOf(item))) {
        this.addMessage('传感器ID错误，测试仪器下挂载的传感器ID存在重复，请检查后重试 ！', 'warning')
        return
      }
      // 检查到测试仪器配置温湿度示值存在非数值。测试仪器配置的温湿度示值有效性检查，必须为数值
      let basevalueCheck = selectedEquipments.some((item) => {
        if (item.device.detectProperty === '温湿度') {
          return !this.$myutil.isValidNumber(parseFloat(item.config.temp)) || !this.$myutil.isValidNumber(parseFloat(item.config.humi))
        } else if (item.device.detectProperty === '温度') {
          return !this.$myutil.isValidNumber(parseFloat(item.config.temp))
        }
      })
      if (basevalueCheck) {
        this.addMessage('测试仪器的温湿度示值输入错误，温湿度示值必须为有效数值 ！', 'warning')
        return
      }
      // 数据检验完成
      // 拓展 selectedEquipments, 添加用于存储传感器数据、检测数据及对应数据时间的键值对
      selectedEquipments.forEach((equipment) => {
        let data = {}
        let ids = equipment.config.IDS
        data['IDS'] = ids.sort((a, b) => a - b)
        data['IDS'].forEach((ID, index, IDS) => {
          data[ID] = {
            'temp': [],
            'humi': [],
            'batt': []
          }
        })
        Object.assign(data, {
          'evennessTemp': [],
          'fluctuationTemp': [],
          'deviationTempSup': [],
          'deviationTempSub': [],
          'evennessHumi': [],
          'fluctuationHumi': [],
          'deviationHumiSup': [],
          'deviationHumiSub': [],
          'averageTemp': [],
          'averageHumi': [],
          'time': []
        })
        Object.assign(equipment, { data })
      })
      this.setCycleTask(cycle)
      this.setIsSenddingTask(isSendding)
      this.setIDSTask(IDS)
      this.setEquiptmentsTask(selectedEquipments) // 初始化设置 store.state 中的测试仪器信息数组
      // 给后台启动测试信号，所有测试设备信息传送到后端程序
      if (this.localeIsSendding) {
        let bufstr = 'AA55' + 'CE' + '06' + '0B' + '00' + cycle.toString(16).padStart(4, '0') + '0100' + '0000'
        let buf = Buffer.from(bufstr, 'hex')
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            this.addMessage('启动测试成功！', 'success')
            this.setIsOnTestTask(true)
            this.setTestTimeTask(this.nowtime())
            this.$router.push({path: '/dashboard'})
          } else {
            this.addMessage('串口写入错误，启动测试失败！', 'warning')
            this.resetEquipmentsTask()
          }
        })
      } else {
        this.addMessage('启动测试成功！', 'success')
        this.setIsOnTestTask(true)
        this.setTestTimeTask(this.nowtime())
        this.$router.push({path: '/dashboard'})
      }
    },
    setData (originData, newData) {
      Object.keys(newData).forEach((key) => {
        if (originData.hasOwnProperty(key)) {
          Vue.set(originData, key, newData[key])
        }
      })
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType !== undefined ? messageType : 'info'
      })
    },
    nowtime () {
      return moment().format('YYYY_MM_DD_HH_mm_ss')
    }
  }
}
</script>

<style>
.test-config .top-bar{
  padding-top: 0;
  padding-bottom: 0;
}

.test-config .el-form--inline {
  padding-top: 8px;
}
.test-config .el-form-item {
  margin-bottom: 0;
}

.test-config .top-bar {
  justify-content: space-between;
}

.cycle-switch{
  display:inline-block;
  padding-top: 1rem;
  padding-left: 2rem;
}
</style>