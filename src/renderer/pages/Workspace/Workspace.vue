<template>
  <div class="workspace main-page">
    <div class="main-title top-bar">
      <span class="item">功能配置页</span>
    </div>

    <el-row class="main-page-container">
      <el-col :span="12">
        <div>
          <h4 class="title">参数配置</h4>
          <el-form :model="SerialPort" :rules="rulesSerialPort" ref="SerialPort" label-position="left" label-width="100px">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item prop="SerialPortName" label="串口号：">
                  <el-input placeholder="输入串口号" v-model.trim="SerialPort.SerialPortName" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="BaudRate" label="波特率：">
                  <el-input placeholder="输入波特率" v-model.trim.number="SerialPort.BaudRate" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="PortSetClick" type="primary" :disabled="isOnTest">提交<i class="el-icon-check el-icon--right"></i></el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-form :model="Battery" :rules="rulesBattery" ref="Battery" label-position="left" label-width="100px">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item prop="BatteryLow" label="最低电压：">
                  <el-input placeholder="输入最低电压" v-model.trim="Battery.BatteryLow" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="BatteryHigh" label="最高电压：">
                  <el-input placeholder="输入最高电压" v-model.trim="Battery.BatteryHigh" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="BatterySetClick" type="primary" :disabled="isOnTest">提交<i class="el-icon-check el-icon--right"></i></el-button>
              </el-col>                      
            </el-row>
          </el-form>
          <el-form :model="idSetting" :rules="rulesidSetting" ref="idSetting" label-position="left" label-width="100px">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item prop="originID" label="原始ID：">
                  <el-input placeholder="输入原始ID" v-model.trim.number="idSetting.originID" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="newID" label="新设ID：">
                  <el-input placeholder="输入新设ID" v-model.trim.number="idSetting.newID" :disabled="isOnTest">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="IDSetClick" type="primary" :disabled="isOnTest">提交<i class="el-icon-check el-icon--right"></i></el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-sensor">
            <el-button @click="SerachSensorClick" type="success" 
            >搜索传感器<i class="el-icon-check el-icon--right"></i></el-button>
            <div class="container">
              <span class="item" v-for="(sensorID) in searchedSensorIDs" :key="sensorID">{{ sensorID }}</span>
            </div>
          </div>
        </div>
        <!-- <div>
          <h4 class="title">传感器标定</h4>
          <el-form :model="sensorCalibration" :rules="rulesSensorCalibration" ref="sensorCalibration" label-position="left" label-width="100px">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item prop="id" label="ID：">
                  <el-input placeholder="ID：" v-model.trim="sensorCalibration.id">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="resistance" label="电阻值：">
                  <el-input placeholder="电阻值：" v-model.trim="sensorCalibration.resistance">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="SubmitSensorCalibration" type="primary">提交<i class="el-icon-check el-icon--right"></i></el-button>
              </el-col>
            </el-row>
          </el-form>
        </div> -->
      </el-col>
      <el-col :span="12" class="template">
        <h4 class="title">测试模板配置</h4>
        <el-form :model="testTemplate" :rules="rulestestTemplate" ref="testTemplate" label-position="left" label-width="150px">
          <el-form-item prop="cycle" label="工作周期(s/秒)：">
            <el-input class="cycle-input" placeholder="请输入工作周期s" v-model.number="testTemplate.cycle" :disabled="isOnTest">
            </el-input>
          </el-form-item>
          <el-form-item prop="humi" label="湿度示值(%RH)：">
            <el-input class="testEq-item-conf-input" placeholder="输入湿度示值" v-model="testTemplate.humi" :disabled="isOnTest">
            </el-input>
          </el-form-item>
          <el-form-item prop="temp" label="温度示值(℃)：">
            <el-input class="testEq-item-conf-input" placeholder="输入温度示值" v-model="testTemplate.temp" :disabled="isOnTest">
            </el-input>
          </el-form-item>
          <el-form-item label="测试模式：">
            <el-switch v-model="testTemplate.isSendding" active-color="#13ce66" inactive-color="#ff4949" active-text="周期获取数据" inactive-text="仅监测数据" :disabled="isOnTest">
            </el-switch>
          </el-form-item>
          <div class="sensor-ids">
            <label for="传感器ID：">传感器ID：</label>
            <el-input v-for="(id,index) in testTemplate.IDS" :key="index"
              class="id-input" v-model.number="testTemplate.IDS[index]" :disabled="isOnTest"></el-input>
            <el-button @click="add_id(testTemplate.IDS)" class="add-id" type="success" icon="el-icon-plus" circle></el-button>
            <el-button @click="del_id(testTemplate.IDS)" class="add-id" type="danger" icon="el-icon-minus" circle></el-button>
          </div>
          <el-button @click="TestTemplateSaveClick" type="primary" :disabled="isOnTest">保存测试模板<i class="el-icon-check el-icon--right"></i></el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import Vue from 'vue'

let rules = {
  SerialPort: {
    SerialPortName: [
      { required: true, message: '请输入串口名', trigger: 'blur' },
      { min: 4, max: 5, message: '长度在 4 到 5 个字符', trigger: 'blur' }
    ],
    BaudRate: [
      { required: true, message: '请输入波特率', trigger: 'change' }
    ]
  },
  Battery: {
    BatteryLow: [
      { required: true, message: '请输入电量值', trigger: 'change' }
    ],
    BatteryHigh: [
      { required: true, message: '请输入电量值', trigger: 'change' }
    ]
  },
  idSetting: {
    originID: [
      { required: true, message: '请输入原始ID', trigger: 'change' }
    ],
    newID: [
      { required: true, message: '请输入新设ID', trigger: 'change' }
    ]
  },
  testTemplate: {
    cycle: [
      { required: true, message: '请输入周期', trigger: 'change' }
    ],
    temp: [
      { required: true, message: '请输入温度示值', trigger: 'change' }
    ],
    humi: [
      { required: true, message: '请输入湿度示值', trigger: 'change' }
    ],
    IDS: [
      { required: true, message: '请输入其他ID', trigger: 'change' }
    ],
    isSendding: [
    ]
  },
  rulesSensorCalibration: {
    id: [
      { required: true, message: '请输入传感器ID', trigger: 'change' }
    ],
    resistance: [
      { required: true, message: '请输入电阻值', trigger: 'change' }
    ]
  }
}

export default {
  name: 'workspace',
  data () {
    return {
      SerialPort: {
        SerialPortName: '',
        BaudRate: ''
      },
      Battery: {
        BatteryLow: '',
        BatteryHigh: ''
      },
      idSetting: {
        originID: '',
        newID: ''
      },
      testTemplate: {
        cycle: '',
        temp: '',
        humi: '',
        IDS: [1],
        isSendding: true
      },
      sensorCalibration: {
        id: '',
        resistance: ''
      },
      rulesSerialPort: rules.SerialPort,
      rulesBattery: rules.Battery,
      rulesidSetting: rules.idSetting,
      rulestestTemplate: rules.testTemplate,
      rulesSensorCalibration: rules.rulesSensorCalibration
    }
  },
  beforeMount () {
    this.initConfig()
  },
  computed: {
    ...mapState(['isOnTest', 'searchedSensorIDs'])
  },
  methods: {
    ...mapActions([
      'clearSearchedSensorIDsTask'
    ]),
    initConfig () {
      // 获取当前程序配置信息，并初始化 data.config
      this.$storage.get('config', (err, data) => {
        if (err) {
          this.addMessage(err)
        }
        this.setData(this.SerialPort, data)
        this.setData(this.Battery, data)
      })
      // 获取当前测试模板信息，并初始化 data.testTemplate
      this.$storage.get('testTemplate', (err, data) => {
        if (err) {
          this.addMessage(err)
        }
        this.setData(this.testTemplate, data)
      })
    },
    PortSetClick () {
      this.$refs['SerialPort'].validate((valid) => {
        if (valid) {
          let param = this.SerialPort
          param.BaudRate = parseInt(param.BaudRate)
          // 串口检查，必须为 COM + 1 格式
          let serialPortNameCheck1 = param.SerialPortName.length <= 3 // 字符串长度不够
          let serialPortNameCheck2 = param.SerialPortName.slice(0, 3).toUpperCase() !== 'COM' // 字符串不是以 COM / com 开头
          let serialPortNameCheck3 = isNaN(Number(param.SerialPortName.slice(3))) // COM 后的字符包含非数字字符
          let serialPortNameCheck4 = !this.$myutil.isPositiveInteger(Number(param.SerialPortName.slice(3)))
          if (serialPortNameCheck1 || serialPortNameCheck2 || serialPortNameCheck3 || serialPortNameCheck4) {
            this.addMessage('错误，串口号输入错误，请按 "COM9" 格式输入！', 'warning')
            return
          }
          // 波特率检查，必须为正整数，且应符合标准常用波特率值 mythis.$myutil.CommonBaudRate 数组中的值
          if (!this.$myutil.isPositiveInteger(param.BaudRate)) {
            this.addMessage('错误，波特率输入错误，应输入正整数的波特率值，请检查后输入！', 'warning')
            return
          }
          // 串口参数保存
          this.$storage.get('config', (err, data) => {
            if (err) {
              this.addMessage('串口参数修改失败！', 'warning')
              return
            }
            data.SerialPortName = param.SerialPortName
            data.BaudRate = param.BaudRate
            this.$storage.set('config', data, (err) => {
              if (err) {
                this.addMessage('串口参数修改失败！', 'warning')
                return
              }
              this.addMessage('串口参数修改成功！', 'success')
            })
          })
        }
      })
    },
    BatterySetClick () {
      this.$refs['Battery'].validate((valid) => {
        if (valid) {
          // 电量参数必须为正数，接受小数
          let param = this.Battery
          param.BatteryHigh = parseFloat(param.BatteryHigh)
          param.BatteryLow = parseFloat(param.BatteryLow)
          if (param === undefined || !this.$myutil.isPositiveNumber(param.BatteryLow) || !this.$myutil.isPositiveNumber(param.BatteryHigh)) {
            this.addMessage('电池电量参数错误，电池参数必须为正数，请检查后重新提交！', 'warning')
            return
          }
          // LowBattery >= HighBattery
          if (param.BatteryLow >= param.BatteryHigh) {
            this.addMessage('电池电量参数错误，电量参数的下限值应小于上限值，请检查后重新提交！', 'warning')
            return
          }
          // 电池参数修改数据保存
          this.$storage.get('config', (err, data) => {
            if (err) {
              this.addMessage('电池电量参数改失败！', 'warning')
              return
            }
            data.BatteryHigh = param.BatteryHigh
            data.BatteryLow = param.BatteryLow
            this.$storage.set('config', data, (err) => {
              if (err) {
                this.addMessage('电池电量参数改失败！', 'warning')
                return
              }
              this.addMessage('电池电量参数改成功！', 'success')
            })
          })
        }
      })
    },
    IDSetClick () {
      this.$refs['idSetting'].validate((valid) => {
        if (valid) {
          let param = {
            originID: parseInt(this.idSetting.originID),
            newID: parseInt(this.idSetting.newID)
          }
          // 是否接收0？
          // 校验数据， 原传感器ID、预设传感器ID均必须为数值
          if (!this.$myutil.isInteger(param.originID) || !this.$myutil.isInteger(param.newID)) {
            this.addMessage('传入的ID参数错误，请检查后重新提交！', 'warning')
            return
          }
          // 检查数值是否超限 0 -255，不可为负值，不可大于255
          if (param.originID < 0 || param.originID > 255 || param.newID < 0 || param.newID > 255) {
            this.addMessage('传入的ID参数越界，必须为0-255之间的数值，请检查后重新提交！', 'warning')
            return
          }
          // 原ID与预设ID相等，直接返回成功提示，不做任何处理。
          if (param.originID === param.newID) {
            this.addMessage('修改ID指令发送成功！', 'success')
            return
          }
          // 解析打包数据(构建为约定的数据格式)
          let bufstr = 'AA55A0060B' + param.originID.toString(16).padStart(2, '0') + param.newID.toString(16).padStart(2, '0') + '0000000000'
          let buf = Buffer.from(bufstr, 'hex')
          // 调用串口发送数据到主节点
          this.$port.serialport.write(buf, (err) => {
            if (!err) {
              // reset store, variable

              this.addMessage('修改ID指令发送成功！', 'success')
            } else {
              this.addMessage('串口写入错误，发送停止测试指令失败，请重新操作！！！', 'warning')
            }
          })
        }
      })
    },
    SerachSensorClick () {
      // 调用串口发送数据到主节点
      let bufstr = 'AA55' + 'A1' + '06' + '0B' + '00' + '00000000' + '0000'
      let buf = Buffer.from(bufstr, 'hex')
      this.$port.serialport.write(buf, (err) => {
        if (!err) {
          this.addMessage('搜索传感器指令发送成功', 'success')
          // 重置当前缓存 搜索传感器ID的变量
          this.clearSearchedSensorIDsTask()
        } else {
          this.addMessage('串口写入错误，搜索传感器指令发送失败！', 'warning')
        }
      })
    },
    TestTemplateSaveClick () {
      this.$refs['testTemplate'].validate((valid) => {
        if (valid) {
          const testTemplate = this.testTemplate
          // 检查IDS中是否包含非法字符
          // if (/[^\d,，]/.test(testTemplate.IDS)) {
          //   this.addMessage('输入的其他传感器ID中包含非法字符，只允许输入整数的传感器ID，且以 "," 隔开！', 'warning')
          //   return
          // }
          // 获取数据周期检查，周期应为正整数，且在 1 - 65535 范围内
          let cycle = parseInt(testTemplate.cycle, 10)
          let temp = parseFloat(testTemplate.temp)
          let humi = parseFloat(testTemplate.humi)
          let IDS = testTemplate.IDS
          // IDS = testTemplate.IDS.split(',').map(id => parseInt(id))
          if (!this.$myutil.isPositiveInteger(cycle) || cycle < 1 || cycle > 65535) {
            this.addMessage('工作周期应输入数值，且在 1 - 65535 范围内，请重新输入！', 'warning')
            return
          }
          // 温度示值检查
          if (!this.$myutil.isValidNumber(temp)) {
            this.addMessage('温度示值应输入有效数值，不可输入非数字字符，请重新输入！', 'warning')
            return
          }
          // 湿度示值检查
          if (!this.$myutil.isPositiveNumber(humi)) {
            this.addMessage('湿度示值应输入有效数值，不可输入非数字字符，请重新输入！', 'warning')
            return
          }
          // IDD检查， IDS输入要求为数值数组
          // if (!(IDS instanceof Array) || IDS.length < 1) {
          //   this.addMessage('其他传感器ID输入内容有误，请重新输入！', 'warning')
          //   return
          // }
          let idsCheck = IDS.some((elem, index, arr) => {
            return !this.$myutil.isPositiveInteger(elem) || elem <= 0 || elem > 255 || (arr.indexOf(elem) !== arr.lastIndexOf(elem))
          })
          if (idsCheck) {
            this.addMessage('传感器ID输入有误，请勿输入非数值字符，且不可输入重复的ID！', 'warning')
            return
          }

          this.$storage.get('testTemplate', (err, data) => {
            if (err) {
              this.addMessage('测试模板修改失败！', 'warning')
              return
            }
            data.cycle = cycle
            data.temp = temp
            data.humi = humi
            data.IDS = IDS
            data.isSendding = testTemplate.isSendding
            this.$storage.set('testTemplate', data, (err) => {
              if (err) {
                this.addMessage('测试模板修改失败！', 'warning')
                return
              }
              this.addMessage('测试模板修改成功！', 'success')
            })
          })
        }
      })
    },
    // SubmitSensorCalibration () {
    //   this.$refs['sensorCalibration'].validate((valid) => {
    //     if (valid) {
    //       // id 必须为正整数
    //       let param = this.sensorCalibration
    //       param.id = parseInt(param.id)
    //       param.resistance = parseFloat(param.resistance)
    //       if (!this.$myutil.isPositiveInteger(param.id)) {
    //         this.addMessage('传感器ID输入有误，必须为正整数，请检查后重新提交！', 'warning')
    //         return
    //       }
    //       // 电阻值必须为正浮点数
    //       if (!this.$myutil.isPositiveNumber(param.resistance)) {
    //         this.addMessage('电阻值输入有误，不可输入负数，请检查后重新提交！', 'warning')
    //         return
    //       }
    //       // 解析打包数据(构建为约定的数据格式)
    //       let buffer = Buffer.alloc(4)
    //       buffer.writeFloatLE(param.resistance)
    //       let resistanceHex = buffer.toString('hex')
    //       let bufstr = 'AA55' + 'A2' + '06' + '0A' + param.id.toString(16).padStart(2, '0') + resistanceHex + '0000'
    //       let buf = Buffer.from(bufstr, 'hex')
    //       // 调用串口发送数据到主节点
    //       this.$port.serialport.write(buf, (err) => {
    //         if (!err) {
    //           this.addMessage('标定传感器指令发送成功！', 'success')
    //         } else {
    //           this.addMessage('串口写入错误，发送停止测试指令失败，请重新操作！！！', 'warning')
    //         }
    //       })
    //     }
    //   })
    // },
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
        type: messageType
      })
    },
    add_id (ids) {
      ids.push(ids[ids.length - 1] + 1)
    },
    del_id (ids) {
      if (ids.length === 1) {
        return
      }
      ids.pop()
    }
  }
}
</script>
