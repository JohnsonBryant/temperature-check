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
        @click="Export"
        >下载数据<i class="el-icon-download el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import path from 'path'
import Excel from 'exceljs'
const remote = require('electron').remote
const dialog = require('electron').remote.dialog
const fs = require('fs')
const moment = require('moment')
const cellStyles = require('../../../utils/cell.json')
const images1 = [
  {
    'imgInfo': {
      filename: path.join(__static, '/img/1.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 0.5, row: 4 },
      br: { col: 2.5, row: 12 },
      editAs: 'absolute'
    }
  },
  {
    'imgInfo': {
      filename: path.join(__static, '/img/2.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 3.5, row: 4 },
      br: { col: 5.5, row: 12 },
      editAs: 'absolute'
    }
  },
  {
    'imgInfo': {
      filename: path.join(__static, '/img/3.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 6.5, row: 4 },
      br: { col: 8.5, row: 12 },
      editAs: 'absolute'
    }
  }
]
const images = [
  {
    'imgInfo': {
      filename: path.join(__static, '/img/1.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 1.5, row: 4 },
      br: { col: 3.5, row: 12 },
      editAs: 'absolute'
    }
  },
  {
    'imgInfo': {
      filename: path.join(__static, '/img/2.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 4.5, row: 4 },
      br: { col: 6.5, row: 12 },
      editAs: 'absolute'
    }
  },
  {
    'imgInfo': {
      filename: path.join(__static, '/img/3.png'),
      extension: 'png'
    },
    'addOption': {
      tl: { col: 7.5, row: 4 },
      br: { col: 9.5, row: 12 },
      editAs: 'absolute'
    }
  }
]
const basedir = remote.app.getPath('userData')
const filepath = (dir, filename) => { return dir === undefined ? path.join(basedir, filename) : path.join(dir, filename) }

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
    Export () {
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
        let exportTime = this.nowtime()
        let equipments = JSON.parse(JSON.stringify(this.equipments))
        // forloop all equipments, flat equipment.data, save data to excel
        equipments.forEach((equipment, index, equipments) => {
          // this.SaveJsonToExcel(result.filePaths[0], equipment)
          this.dataToExcel(this, result.filePaths[0], equipment, exportTime)
        })
        this.addMessage(`数据文件导出到 ${result.filePaths[0]} 成功！`, 'success')
      })
    },
    dataToExcel (context, dir = './', equipment = {}, exportTime = '') {
      let dirname = path.join(dir, this.getPeviceName(equipment.device) + exportTime)
      fs.mkdir(dirname, { recursive: true }, (err) => {
        if (err) console.log(err)
        var workbook = new Excel.Workbook()
        // 生成原始数据表
        let originalPath = path.join(__static, '/template/original.xlsx')
        workbook.xlsx.readFile(originalPath).then(function (value) {
          // add image into worksheets[0]
          let worksheet = workbook.worksheets[0]
          for (let i = 0; i < images1.length; i++) {
            let imageid = workbook.addImage(images1[i].imgInfo)
            worksheet.addImage(imageid, images1[i].addOption)
          }
          // add data to worksheets[0]
          if (equipment.device.detectProperty === '温湿度') {
            context.addDataToSheet(worksheet, 15, equipment, '温度')
            context.addDataToSheet(worksheet, 15 + equipment.config.count + 8 + 2, equipment, '湿度')
          } else if (equipment.device.detectProperty === '温度') {
            context.addDataToSheet(worksheet, 15, equipment, '温度')
          }
          // write workbook to file
          workbook.xlsx.writeFile(filepath(dirname, '/环境试验试验设备原始记录.xlsx')).then(function (value) {
            // success
            context.addMessage('环境试验试验设备原始记录.xlsx 导出成功')
          }, (err) => {
            context.addMessage(err)
          })
        }, (err) => {
          context.addMessage(err)
        })
        // 根据模板生成证书表格
        let certificateTemplate = ''
        let data = []
        if (equipment.device.detectProperty === '温湿度') {
          certificateTemplate = path.join(__static, '/template/certificate.xlsx')
          data.push(
            ['E18', equipment.config.temp],
            ['E20', equipment.data.deviationTempSup],
            ['E24', equipment.data.deviationTempSub],
            ['E28', equipment.data.evennessTemp],
            ['E30', equipment.data.fluctuationTemp],
            ['G18', equipment.config.humi],
            ['G20', equipment.data.deviationHumiSup],
            ['G24', equipment.data.deviationHumiSub],
            ['G28', equipment.data.evennessHumi],
            ['G30', equipment.data.fluctuationHumi]
          )
        } else if (equipment.device.detectProperty === '温度') {
          certificateTemplate = path.join(__static, '/template/certificate-temp.xlsx')
          data.push(
            ['E18', equipment.config.temp],
            ['E20', equipment.data.deviationTempSup],
            ['E24', equipment.data.deviationTempSub],
            ['E28', equipment.data.evennessTemp],
            ['E30', equipment.data.fluctuationTemp]
          )
        }
        workbook.xlsx.readFile(certificateTemplate).then(function (value) {
          // add image into worksheets[0]
          let worksheet = workbook.worksheets[0]
          for (let i = 0; i < images.length; i++) {
            let imageid = workbook.addImage(images[i].imgInfo)
            worksheet.addImage(imageid, images[i].addOption)
          }
          // add data to worksheets[0]
          for (let i = 0; i < data.length; i++) {
            let cell = worksheet.getCell(data[i][0])
            // 修改/添加单个单元格
            cell.value = data[i][1]
          }
          // 确定每项数据对应的单元格位置， 更新单元格数据， 创建生成结果数据文件
          let exportfilePath = filepath(dirname, '环境试验试验设备校准证书.xlsx')
          workbook.xlsx.writeFile(exportfilePath).then(function (value) {
            // success
            context.addMessage('环境试验试验设备校准证书.xlsx 导出成功')
          }, function (err) {
            context.addMessage(err)
          })
        }, function (err) {
          context.addMessage(err)
        })
      })
    },
    addDataToSheet (worksheet, startRowNum, equipment, type = '温度') {
      let col = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const setMergeStyle = (n, colStart, row, style) => {
        for (let i = 0; i < n; i++) {
          worksheet.getCell(`${col[col.indexOf(colStart) + i]}${row}`).style = style
        }
      }
      // let startRowNum = 15 // 开始行数
      let rowNum
      let data, testConfig, evenness, fluctuation, deviationSup, deviationSub, specValue1
      let ids = equipment.config.IDS.slice() // 传感器ID
      let colNum = ids.length + 2 // 总列数
      // 数据构建二维数组
      if (type === '温度') {
        specValue1 = cellStyles.F37_Value
        rowNum = equipment.exportData.temp.length
        data = equipment.exportData.temp
        testConfig = equipment.config.temp
        evenness = equipment.data.evennessTemp
        fluctuation = equipment.data.fluctuationTemp
        deviationSup = equipment.data.deviationTempSup
        deviationSub = equipment.data.deviationTempSub
      } else if (type === '湿度') {
        specValue1 = cellStyles.F62_Value
        rowNum = equipment.exportData.temp.length
        data = equipment.exportData.humi
        testConfig = equipment.config.humi
        evenness = equipment.data.evennessHumi
        fluctuation = equipment.data.fluctuationHumi
        deviationSup = equipment.data.deviationHumiSup
        deviationSub = equipment.data.deviationHumiSub
      }
      // 头 - 1.温度参数校准（单位：℃）
      worksheet.unMergeCells('A15')
      worksheet.mergeCells(`${col[0]}${startRowNum}:${col[colNum - 1]}${startRowNum}`)
      worksheet.getCell(`A${startRowNum}`).value = `${type}参数校准（单位：℃）`
      // 设定值 标签
      let cell1 = worksheet.getCell(`A${startRowNum + 1}`)
      cell1.value = `${type}设定`
      cell1.style = cellStyles.A16
      // 设定值 数值
      let cell2 = worksheet.getCell(`B${startRowNum + 1}`)
      cell2.value = testConfig
      cell2.style = cellStyles.B16
      // 设定值 数值
      let cell21 = worksheet.getCell(`C${startRowNum + 1}`)
      cell21.value = '℃'
      cell21.style = cellStyles.A16
      // 表格 - 左顶 - 次数 - 上下两格
      worksheet.unMergeCells(`A${startRowNum + 2}`)
      worksheet.mergeCells(`A${startRowNum + 2}:A${startRowNum + 3}`)
      let cell3 = worksheet.getCell(`A${startRowNum + 2}`)
      cell3.value = '次数'
      cell3.style = cellStyles.A17
      worksheet.getCell(`A${startRowNum + 3}`).style = cellStyles.A17
      // 表格 - 中上 - 实测标题
      worksheet.unMergeCells(`B${startRowNum + 2}`)
      worksheet.mergeCells(`B${startRowNum + 2}:${col[colNum - 2]}${startRowNum + 2}`)
      let cell4 = worksheet.getCell(`B${startRowNum + 2}`)
      cell4.value = `实测${type}值`
      cell4.style = cellStyles.B17
      setMergeStyle(ids.length, 'B', startRowNum + 2, cellStyles.B17)
      // 表格 - 右上 - 单次 - 均匀度
      let cell5 = worksheet.getCell(`${col[colNum - 1]}${startRowNum + 2}`)
      cell5.value = '单次'
      cell5.style = cellStyles.K17
      let cell6 = worksheet.getCell(`${col[colNum - 1]}${startRowNum + 3}`)
      cell6.value = '均匀度'
      cell6.style = cellStyles.K17
      // 表格 - 中下 - 测点编号 - 系列值
      for (let i = 0; i < ids.length; i++) {
        let cell = worksheet.getCell(`${col[1 + i]}${startRowNum + 3}`)
        cell.value = ids[i]
        cell.style = cellStyles.B18
      }
      // 表格数据 - 二维数组 - 先行 后列 逐个处理每个单元格
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
          let cell = worksheet.getCell(`${col[0 + c]}${startRowNum + 4 + r}`)
          cell.value = data[r][c]
          if (r < rowNum - 2) {
            if (c === 0) {
              cell.style = cellStyles.A19
            } else if (c === data[r].length - 1) {
              cell.style = cellStyles.K19
            } else {
              cell.style = cellStyles.B19
            }
          } else {
            if (c === 0) {
              cell.style = cellStyles.A34
            } else {
              cell.style = cellStyles.B34
            }
          }
        }
      }
      // 表格 - 上偏差
      let cell7 = worksheet.getCell(`A${startRowNum + 4 + rowNum}`)
      cell7.value = '上偏差'
      cell7.style = cellStyles.A34
      let cell71 = worksheet.getCell(`B${startRowNum + 4 + rowNum}`)
      cell71.value = deviationSup
      cell71.style = cellStyles.B34
      // 表格 - 下偏差
      worksheet.unMergeCells(`C${startRowNum + 4 + rowNum}`)
      worksheet.mergeCells(`C${startRowNum + 4 + rowNum}:D${startRowNum + 4 + rowNum}`)
      let cell8 = worksheet.getCell(`C${startRowNum + 4 + rowNum}`)
      cell8.value = '下偏差'
      cell8.style = cellStyles.A34
      setMergeStyle(2, 'C', startRowNum + 4 + rowNum, cellStyles.A34)
      let cell81 = worksheet.getCell(`E${startRowNum + 4 + rowNum}`)
      cell81.value = deviationSub
      cell81.style = cellStyles.B34
      // 表格 - 均匀度
      worksheet.unMergeCells(`F${startRowNum + 4 + rowNum}`)
      worksheet.mergeCells(`F${startRowNum + 4 + rowNum}:G${startRowNum + 4 + rowNum}`)
      let cell9 = worksheet.getCell(`F${startRowNum + 4 + rowNum}`)
      cell9.value = '均匀度'
      cell9.style = cellStyles.A34
      setMergeStyle(2, 'F', startRowNum + 4 + rowNum, cellStyles.A34)
      let cell91 = worksheet.getCell(`H${startRowNum + 4 + rowNum}`)
      cell91.value = evenness
      cell91.style = cellStyles.B34
      // 表格 - 波动度
      worksheet.unMergeCells(`I${startRowNum + 4 + rowNum}`)
      worksheet.mergeCells(`I${startRowNum + 4 + rowNum}:J${startRowNum + 4 + rowNum}`)
      let cell10 = worksheet.getCell(`I${startRowNum + 4 + rowNum}`)
      cell10.value = '波动度'
      cell10.style = cellStyles.A34
      setMergeStyle(2, 'I', startRowNum + 4 + rowNum, cellStyles.A34)
      let cell101 = worksheet.getCell(`K${startRowNum + 4 + rowNum}`)
      cell101.value = fluctuation
      cell101.style = cellStyles.B34
      // 固定内容， 自动适应行变化
      // 表格 - 上下偏差 不确定度
      worksheet.unMergeCells(`A${startRowNum + 4 + rowNum + 1}`)
      worksheet.mergeCells(`A${startRowNum + 4 + rowNum + 1}:E${startRowNum + 4 + rowNum + 1}`)
      let cell11 = worksheet.getCell(`A${startRowNum + 4 + rowNum + 1}`)
      cell11.value = `${type}上偏差不确定度`
      cell11.style = cellStyles.A37
      setMergeStyle(5, 'A', startRowNum + 4 + rowNum + 1, cellStyles.A37)
      worksheet.unMergeCells(`F${startRowNum + 4 + rowNum + 1}`)
      worksheet.mergeCells(`F${startRowNum + 4 + rowNum + 1}:K${startRowNum + 4 + rowNum + 1}`)
      let cell111 = worksheet.getCell(`F${startRowNum + 4 + rowNum + 1}`)
      cell111.value = specValue1
      cell111.style = cellStyles.F37
      setMergeStyle(6, 'F', startRowNum + 4 + rowNum + 1, cellStyles.A37)
      worksheet.unMergeCells(`A${startRowNum + 4 + rowNum + 2}`)
      worksheet.mergeCells(`A${startRowNum + 4 + rowNum + 2}:E${startRowNum + 4 + rowNum + 2}`)
      let cell12 = worksheet.getCell(`A${startRowNum + 4 + rowNum + 2}`)
      cell12.value = `${type}下偏差不确定度`
      cell12.style = cellStyles.A37
      setMergeStyle(5, 'A', startRowNum + 4 + rowNum + 2, cellStyles.A37)
      worksheet.unMergeCells(`F${startRowNum + 4 + rowNum + 2}`)
      worksheet.mergeCells(`F${startRowNum + 4 + rowNum + 2}:K${startRowNum + 4 + rowNum + 2}`)
      let cell121 = worksheet.getCell(`F${startRowNum + 4 + rowNum + 2}`)
      cell121.value = specValue1
      cell121.style = cellStyles.F37
      setMergeStyle(6, 'F', startRowNum + 4 + rowNum + 2, cellStyles.A37)
    },
    getPeviceName (device) {
      return `/${device.detectProperty}_${device.company}_${device.em}_${device.deviceName}_${device.deviceType}_${device.deviceID}`
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType !== undefined ? messageType : 'info'
      })
    },
    nowtime () {
      return moment().format('_YYYY-MM-DD-HH-mm-ss')
    }
  }
}
</script>
