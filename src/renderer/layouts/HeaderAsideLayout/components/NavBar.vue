<template>
  <div class="navbar" mode="horizontal">
    <div class="nav-state">
      <span class="item breath"
        :style="{animationName: isOnTest ? 'green-breath' : 'red-breath'}"></span>
      <span class="item">{{ stateImageAlt }}</span>
    </div>
    <div class="right">
      <el-button
        class="btn"
        type="primary" round
        :disabled="!isOnTest"
        @click="StopTest"
        >停止测试</el-button>
      <el-button
        class="btn" 
        type="primary" round
        @click="ExportData"
        >下载数据<i class="el-icon-download el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import XLSX from 'xlsx'
import path from 'path'
const dialog = require('electron').remote.dialog

export default {
  name: 'NavBar',
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['isOnTest', 'equipments']),
    stateImgeUrl () {
      return 'static/img/' + (this.isOnTest ? 'on' : 'off') + '.png'
    },
    stateImageAlt () {
      return '系统状态：' + (this.isOnTest ? '测试中' : '未测试')
    }
  },
  methods: {
    ...mapActions(['setIsOnTestTask']),
    StopTest () {
      // 检查当前是否在 非测试状态
      if (!this.isOnTest) {
        return
      }
      // 提示用户确认，是否停止采集
      this.$confirm(`<strong>此操作将停止采集数据,是否继续?</strong>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let buf = Buffer.from('AA55' + 'CC' + '06' + '0B' + '00000000' + '000000', 'hex')
        this.$port.serialport.write(buf, (err) => {
          if (!err) {
            // reset store, variable
            this.setIsOnTestTask(false)
            this.addMessage('停止测试成功！', 'success')
          } else {
            this.addMessage('串口写入错误，发送停止测试指令失败，请重新操作！！！', 'warning')
          }
        })
      }).catch((err) => {
        this.addMessage(`错误：${err.message}`)
      })
    },
    ExportData () {
      if (this.equipments.length === 0) {
        this.addMessage(`当前无测试数据，未导出文件！`, 'warning')
        return
      }

      let o = dialog.showOpenDialog({
        title: '保存文件',
        properties: ['openDirectory', 'createDirectory'],
        filters: [{
          name: 'Spreadsheets'
        }]
      })
      o.then((result) => {
        if (result.canceled) {
          return
        }
        if (result.filePaths[0] === undefined) {
          this.addMessage(`未选择导出文件的存储位置，取消导出文件！`, 'warning')
          return
        }

        let equipments = JSON.parse(JSON.stringify(this.equipments))
        // forloop all equipments, flat equipment.data, save data to excel
        equipments.forEach((equipment, index, equipments) => {
          this.SaveJsonToExcel(result.filePaths[0], equipment)
        })
        this.addMessage(`数据文件导出到 ${result.filePaths[0]} 成功！`, 'success')
      })
    },
    SaveJsonToExcel (dir = './', equipmentData = {}, exportTime = '') {
      let excelName = path.join(dir, `/${this.getPeviceName(equipmentData.device)}_${exportTime}.xlsx`)
      let data = equipmentData.data
      let packNum = data.evennessTemp.length
      let IDS = equipmentData.config.IDS.slice().sort((a, b) => a - b)
      let centerID = equipmentData.config.centerID
      let tempConfig = equipmentData.config.temp
      let humiConfig = equipmentData.config.humi
      let sensorDataTemp = [] /* pack data to array of array */
      let sensorDataHumi = []
      let columnHeadersTemp = ['温度示值', '温度均匀度', '温度波动度', '温度偏差', `中心点(ID${centerID})温度`]
      let columnHeadersHumi = ['湿度示值', '湿度均匀度', '湿度波动度', '湿度偏差', `中心点(ID${centerID})湿度`]
      IDS.forEach((id, index, ids) => {
        columnHeadersTemp.push(`ID${id}温度`)
        columnHeadersHumi.push(`ID${id}湿度`)
      })
      sensorDataTemp.push(columnHeadersTemp)
      sensorDataHumi.push(columnHeadersHumi)
      for (let i = 0; i < packNum; i++) {
        let rowTemp = [tempConfig, data.evennessTemp[i], data.fluctuationTemp[i], data.deviationTemp[i], data[centerID]['temp'][i]]
        let rowHumi = [humiConfig, data.evennessHumi[i], data.fluctuationHumi[i], data.deviationHumi[i], data[centerID]['humi'][i]]
        let startKey = rowHumi.length
        for (let j = 0; j < IDS.length; j++) {
          rowTemp.push(data[IDS[j]]['temp'][startKey + j])
          rowHumi.push(data[IDS[j]]['humi'][startKey + j])
        }
        sensorDataTemp.push(rowTemp)
        sensorDataHumi.push(rowHumi)
      }
      let wb = XLSX.utils.book_new() /* generate new workbook object */
      let wsTemp = XLSX.utils.aoa_to_sheet(sensorDataTemp) /* transfer array of array to worksheet */
      let wsHumi = XLSX.utils.aoa_to_sheet(sensorDataHumi)
      let colsWidth = new Array(columnHeadersTemp.length).fill({ width: 18 })
      wsTemp['!cols'] = colsWidth
      wsHumi['!cols'] = colsWidth
      XLSX.utils.book_append_sheet(wb, wsTemp, '温度检测数据') /* Add the worksheet to the workbook */
      XLSX.utils.book_append_sheet(wb, wsHumi, '湿度检测数据')
      XLSX.writeFile(wb, excelName) /* generate file and force a download */
    },
    getPeviceName (device) {
      return `${device.company}_${device.em}_${device.deviceName}_${device.deviceType}_${device.deviceID}`
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
