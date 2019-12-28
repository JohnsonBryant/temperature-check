<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="main-control">
      <el-button 
        class="main-control-btn" 
        type="success" round
        @click="StopTest"
        >停止测试</el-button>
      <el-button
        class="main-control-btn" 
        type="primary" round
        @click="ExportData"
        >下载数据<i class="el-icon-download el-icon--right"></i>
      </el-button>
    </div>
  </el-menu>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import XLSX from 'xlsx'

export default {
  name: 'NavBar',
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['isOnTest'])
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
      // forloop all equipments, flat equipment.data, save data to excel
      let sensorData = [
        {'仪器名称': '温湿度检测仪-GH-100-01-001'},
        {
          '中心点(ID1)温度': '1',
          'ID2温度': '1',
          'ID3温度': '1',
          '温度均匀度': '1',
          '温度波动度': '1',
          '温度偏差': '1',
          '中心点(ID1)湿度': '1',
          'ID2湿度': '1',
          'ID3湿度': '1',
          '湿度均匀度': '1',
          '湿度波动度': '1',
          '湿度偏差': '1'
        }
      ]
      let columnHeaders = ['仪器名称', '温度示值', '中心点(ID1)温度', 'ID2温度', 'ID3温度', '温度均匀度', '温度波动度', '温度偏差', '湿度示值', '中心点(ID1)湿度', 'ID2湿度', 'ID3湿度', '湿度均匀度', '湿度波动度', '湿度偏差']
      let excelName = '测试仪器1检测数据.xlsx'
      this.SaveJsonToExcel(excelName, sensorData, columnHeaders)
      // save graph image
      // alert('数据下载成功！')
    },
    SaveJsonToExcel (fileName = 'sheetjs.xlsx', data = [], header = []) {
      /* generate new workbook object */
      var wb = XLSX.utils.book_new()
      var wsName = '检测数据'
      /* make worksheet */
      let dataExport = data === [] ? [
        { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
        { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 },
        { t: 6, J: 7, S_1: 8 }
      ] : data
      var ws = XLSX.utils.json_to_sheet(dataExport, {header: header})
      XLSX.utils.book_append_sheet(wb, ws, wsName) /* Add the worksheet to the workbook */
      XLSX.writeFile(wb, fileName) /* generate file and force a download */
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType === undefined ? messageType : 'info'
      })
    }
  }
}
</script>

<style>
.navbar .main-control{
  display: flex;
  align-self: center;
  top: 0;
  right: 25px;
  height: 64px;
}

.navbar .main-control .main-control-btn{
  align-self: center;
  margin-left: 30px;
}
</style>

