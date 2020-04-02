<template>
  <el-form class="add-equipment main-page" :model="info" :rules="rulesCompany" ref="info">
    <div class="main-title top-bar">
      <span class="item">新增仪器</span>
      
      <el-form-item class="item company" prop="company" :show-message="false">
        <el-input placeholder="请输入委托单位名称" v-model="info.company" :disabled="isOnTest">
          <template slot="prepend">委托单位：</template>
        </el-input>
      </el-form-item>
      
      <div class="item controls">
        <el-button class="item" type="primary" icon="el-icon-check" round @click="submitAddEquipment" :disabled="isOnTest">提交</el-button>
        <el-button class="item" type="primary" icon="el-icon-back" round @click="goBackToLandingPage">返回</el-button>
      </div>
    </div>
    <el-row class="main-page-container">
      <!-- 单个测试仪器信息输入模块 -->
      <el-col :span="8" v-for="(equipment, index) in info.equipmentInfo" :key="index">
        <el-form 
          :model="equipment" :rules="rulesEquipmentInfo" ref="'equipment'+index"
          label-position="right" label-width="100px">
          <div class="box-item">
            <el-form-item prop="em" label="仪器厂家：">
              <el-input class="device-input" placeholder="请输入仪器厂家" v-model="equipment.em" :disabled="isOnTest">
              </el-input>
            </el-form-item>
            <el-form-item prop="deviceName" label="仪器名称：">
              <el-input class="device-input" placeholder="请输入仪器名称" v-model="equipment.deviceName" :disabled="isOnTest">
              </el-input>
            </el-form-item>
            <el-form-item prop="deviceType" label="仪器型号：">
              <el-input class="device-input" placeholder="请输入仪器型号" v-model="equipment.deviceType" :disabled="isOnTest">
              </el-input>
            </el-form-item>
            <el-form-item prop="deviceID" label="仪器编号：">
              <el-input class="device-input" placeholder="请输入仪器编号" v-model="equipment.deviceID" :disabled="isOnTest">
              </el-input>
            </el-form-item>
            <el-form-item label="测量类型：">
              <el-select v-model="equipment.detectProperty" placeholder="请选择测量类型" :disabled="isOnTest">
                <el-option v-for="item in detectPropertys" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <!-- 新增单个测试仪器信息控制按钮模块 -->
      <el-col :span="8">
        <div class="box-item btns">
          <el-button class="btn btn-add" type="success" icon="el-icon-plus" circle @click="addEqInputItem" :disabled="isOnTest"
          ></el-button>
          <el-button class="btn btn-delete" type="danger" icon="el-icon-minus" circle @click="deleteEqInputItem" :disabled="isOnTest"></el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {mapState, mapActions} from 'vuex'

let rulesCompany = {
  company: [
    {required: true, message: '请输入委托单位', trigger: ['blur', 'change']}
  ]
}
let rulesEquipmentInfo = {
  em: [
    {required: true, message: '请输入仪器厂家', trigger: ['blur', 'change']}
  ],
  deviceName: [
    {required: true, message: '请输入仪器名称', trigger: ['blur', 'change']}
  ],
  deviceType: [
    {required: true, message: '请输入仪器类型', trigger: ['blur', 'change']}
  ],
  deviceID: [
    {required: true, message: '请输入仪器ID', trigger: ['blur', 'change']}
  ]
}
let detectPropertys = [{
  value: '温湿度',
  label: '温湿度'
}, {
  value: '温度',
  label: '温度'
}]

export default {
  name: 'add-equipment',
  data () {
    return {
      info: {
        company: '',
        equipmentInfo: [
          {em: '', deviceName: '', deviceType: '', deviceID: '', detectProperty: '温湿度'}
        ]
      },
      rulesEquipmentInfo: rulesEquipmentInfo,
      rulesCompany: rulesCompany,
      detectPropertys: detectPropertys
    }
  },
  beforeMount () {
    this.initCopyDevice()
  },
  computed: {
    ...mapState(['isOnTest', 'duplicatedEquipment'])
  },
  methods: {
    ...mapActions(['reSetDuplicatedEquipmentTask']),
    initCopyDevice () {
      if (this.duplicatedEquipment.hasOwnProperty('company')) {
        // 更新 info.equipmentInfo[0]
        this.info.company = this.duplicatedEquipment.company
        for (let key in this.duplicatedEquipment) {
          if (this.info.equipmentInfo[0].hasOwnProperty(key)) {
            this.info.equipmentInfo[0][key] = this.duplicatedEquipment[key]
          }
        }
      }
    },
    addEqInputItem () {
      let device = {em: '', deviceName: '', deviceType: '', deviceID: '', detectProperty: '温湿度'}
      if (this.duplicatedEquipment.hasOwnProperty('company')) {
        device.deviceName = this.duplicatedEquipment.deviceName
        device.em = this.duplicatedEquipment.em
        device.deviceType = this.duplicatedEquipment.deviceType
        device.deviceID = this.duplicatedEquipment.deviceID
        device.detectProperty = this.duplicatedEquipment.detectProperty
      }
      this.info.equipmentInfo.push(device)
    },
    deleteEqInputItem () {
      if (this.info.equipmentInfo.length <= 1) {
        return
      }
      this.info.equipmentInfo.pop({em: '', deviceName: '', deviceType: '', deviceID: ''})
    },
    goBackToLandingPage () {
      this.reSetDuplicatedEquipmentTask()
      this.$router.push({path: '/landingPage'})
    },
    submitAddEquipment () {
      // 输入的仪器信息检查 : 输入不能为空
      this.$refs['info'].validate((valid) => {
        if (valid) {
          // 输入的仪器不能存在完全相同
          if (!this.validateEquipmentInfo()) {
            this.addMessage('请勿输入两组完全相同的仪器信息！请修改后重新提交！', 'warning')
            return
          }
          // 打包已输入的仪器信息数组
          let dnow = this.$myutil.nowtime()
          let equipmentInfo = this.info.equipmentInfo.slice().map((item) => {
            item.company = this.info.company
            item.insertDate = dnow
            return item
          })
          // 使用每个仪器信息 分别向 执行保存
          equipmentInfo.forEach(element => {
            let eq = element
            // 检查是否已存在仪器
            let sqlQuery = `select count(*) as count from equipment where company=? and em=? and deviceName=? and deviceType=? and deviceID=?`
            // 检查新增的仪器是否已存在
            this.$sqliteDB.queryDataWithParam(sqlQuery, [eq.company, eq.em, eq.deviceName, eq.deviceType, eq.deviceID], (rows) => {
              if (rows[0].count > 0) {
                this.addMessage('仪器已存在，请勿重复添加！', 'warning')
                return
              }
              // 仪器数据写入
              let equipment = [[eq.company, eq.em, eq.deviceName, eq.deviceType, eq.deviceID, eq.detectProperty, eq.insertDate]]
              let sqlInsert = 'insert into equipment(company, em, deviceName, deviceType, deviceID, detectProperty, insertDate) values (?, ?, ?, ?, ?, ?, ?)'
              this.$sqliteDB.insertData(sqlInsert, equipment, (err) => {
                if (err) {
                  this.addMessage('新增仪器失败！', 'warning')
                } else {
                  this.addMessage('新增仪器成功！', 'success')
                }
              })
            })
          })
          this.$router.push({path: '/landingPage'})
        }
      })
    },
    validateEquipmentInfo () {
      // 检查
      let equipmentInfo = this.info.equipmentInfo.map((item, index) => {
        let equipmentString = ''
        let arr = Object.keys(item)
        for (let i = 0; i < arr.length; i++) {
          equipmentString += '-' + item[arr[i]]
        }
        return equipmentString.slice(1)
      })
      let checkResult = equipmentInfo.some((item, index, equipmentInfo) => {
        return equipmentInfo.indexOf(item) !== equipmentInfo.lastIndexOf(item)
      })
      return !checkResult
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType
      })
    }
  }
}
</script>
