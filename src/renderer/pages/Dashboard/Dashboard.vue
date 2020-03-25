<template>
<div class="dashboard main-page">
  <div class="main-page-title top-bar">
    <span class="top-bar-item">实时监测</span>
  </div>
  <div class="main-page-container" >
    <div v-if="showMessageState">
      <div class="warn-text">
        <h4>当前系统未处在测试状态，如需要进行测试，请切换到设备管理页，选择测试设备，启动测试！</h4>
        <h5>以下为测试示例，实际测试效果可参考如下图表！</h5>
      </div>
      <test-item-th 
        :equipment="demo.equipment"
        :updateTime="demo.updateTime"
        :test-data="demo.testData"
        :temps="demo.temps"
        :humis="demo.humis"
      />
    </div>

    <div v-for="(item,index) in DeviceTestDatas" :key="index">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-data"></i> 数据走势</span>
          <template v-if="item.equipment.detectProperty === '温湿度'">
            <test-item-th 
              :equipment="item.equipment"
              :updateTime="item.updateTime"
              :packNumber="item.packNumber"
              :test-data="item.testData"
              :temps="item.temps"
              :humis="item.humis"
            />
          </template>
          <template v-else-if="item.equipment.detectProperty === '温度'">
            <test-item-temp 
              :equipment="item.equipment"
              :updateTime="item.updateTime"
              :packNumber="item.packNumber"
              :test-data="item.testData"
              :temps="item.temps"
            />
          </template>          
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-grid"></i> 数据表格</span>
          <template v-if="item.equipment.detectProperty === '温湿度'">
            <test-item-table-th 
              :equipment="DeviceTestDataTable[index].equipment"
              :tempTestDataTable="DeviceTestDataTable[index].tempTestDataTable"
              :humiTestDataTable="DeviceTestDataTable[index].humiTestDataTable"
              :ids="DeviceTestDataTable[index].ids"
              />
          </template>
          <template v-else-if="item.equipment.detectProperty === '温度'">
            <test-item-table-temp
              :equipment="DeviceTestDataTable[index].equipment"
              :tempTestDataTable="DeviceTestDataTable[index].tempTestDataTable"
              :ids="DeviceTestDataTable[index].ids"
              />
          </template>    
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</div>
</template>

<script>
import {mapState
  // , mapActions
} from 'vuex'
import TestItemTH from './TestItemTH'
import TestItemTemp from './TestItemTemp'
import TestItemTableTH from './TestItemTableTH'
import TestItemTableTemp from './TestItemTableTemp'
import 'echarts/lib/chart/line'

import demo from './template.js'

const template = () => {
  return {
    title: {
      text: '', // 根据数据生成 ， 曲线数据类型 温度、湿度
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 35,
      textStyle: {
        fontSize: 14
      },
      data: [] // 根据数据生成， 对应曲线图标题数组
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        // dataZoom: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [] // 根据数据生成， 数据时间数组， 对应曲线图的 X 轴
    },
    yAxis: {
      type: 'value',
      max: function (value) {
        return parseFloat((value.max + (value.max - value.min) * 0.1).toFixed(2)) + 1
      },
      min: function (value) {
        return parseFloat((value.min - (value.max - value.min) * 0.1).toFixed(2)) - 1
      }
    },
    series: [
      {
        name: 'ID1', // 根据数据生成， 传感器ID
        type: 'line',
        data: [] // 传感器数据
      }
    ]
  }
}

export default {
  components: {
    'test-item-th': TestItemTH,
    'test-item-temp': TestItemTemp,
    'test-item-table-th': TestItemTableTH,
    'test-item-table-temp': TestItemTableTemp
  },
  data () {
    return {
      demo: demo
    }
  },
  computed: {
    ...mapState(['isOnTest', 'equipments']),
    DeviceTestDatas () {
      const equipments = this.equipments
      let deviceTestDatas = []
      equipments.forEach((ele, index, equipments) => {
        let deviceTestData = {}
        deviceTestData.equipment = ele.device
        deviceTestData.testData = []
        if (ele.device.detectProperty === '温湿度') {
          ele.data['IDS'].forEach((id) => {
            let sensor = ele.data[id]
            let len = sensor['temp'].length
            let temp = len === 0 ? '' : sensor['temp'][len - 1]
            let humi = len === 0 ? '' : sensor['humi'][len - 1]
            let batt = len === 0 ? '' : sensor['batt'][len - 1]
            let sensorData = {
              name: `${id}-电量${batt}%`,
              tempData: temp,
              humiData: humi
            }
            deviceTestData.testData.push(sensorData)
          })
          let dataLen = ele.data['evennessTemp'].length
          let evennessTemp = dataLen === 0 ? '' : ele.data['evennessTemp'][dataLen - 1]
          let evennessHumi = dataLen === 0 ? '' : ele.data['evennessHumi'][dataLen - 1]
          let fluctuationTemp = dataLen === 0 ? '' : ele.data['fluctuationTemp'][dataLen - 1]
          let fluctuationHumi = dataLen === 0 ? '' : ele.data['fluctuationHumi'][dataLen - 1]
          let deviationTempSup = dataLen === 0 ? '' : ele.data['deviationTempSup'][dataLen - 1]
          let deviationTempSub = dataLen === 0 ? '' : ele.data['deviationTempSub'][dataLen - 1]
          let deviationHumiSup = dataLen === 0 ? '' : ele.data['deviationHumiSup'][dataLen - 1]
          let deviationHumiSub = dataLen === 0 ? '' : ele.data['deviationHumiSub'][dataLen - 1]
          deviceTestData.testData.push({
            name: '均匀度',
            tempData: evennessTemp,
            humiData: evennessHumi
          })
          deviceTestData.testData.push({
            name: '波动度',
            tempData: fluctuationTemp,
            humiData: fluctuationHumi
          })
          deviceTestData.testData.push({
            name: '上偏差',
            tempData: deviationTempSup,
            humiData: deviationHumiSup
          })
          deviceTestData.testData.push({
            name: '下偏差',
            tempData: deviationTempSub,
            humiData: deviationHumiSub
          })
          deviceTestData.updateTime = dataLen === 0 ? '' : ele.data['time'][dataLen - 1]
          deviceTestData.packNumber = dataLen
          deviceTestData.temps = this.prepareGraphData('温度', 'temp', ele.data)
          deviceTestData.humis = this.prepareGraphData('湿度', 'humi', ele.data)
          deviceTestDatas.push(deviceTestData)
        } else if (ele.device.detectProperty === '温度') {
          ele.data['IDS'].forEach((id) => {
            let sensor = ele.data[id]
            let len = sensor['temp'].length
            let temp = len === 0 ? '' : sensor['temp'][len - 1]
            let batt = len === 0 ? '' : sensor['batt'][len - 1]
            let sensorData = {
              name: `${id}-电量${batt}%`,
              tempData: temp
            }
            deviceTestData.testData.push(sensorData)
          })
          let dataLen = ele.data['evennessTemp'].length
          let evennessTemp = dataLen === 0 ? '' : ele.data['evennessTemp'][dataLen - 1]
          let fluctuationTemp = dataLen === 0 ? '' : ele.data['fluctuationTemp'][dataLen - 1]
          let deviationTempSup = dataLen === 0 ? '' : ele.data['deviationTempSup'][dataLen - 1]
          let deviationTempSub = dataLen === 0 ? '' : ele.data['deviationTempSub'][dataLen - 1]
          deviceTestData.testData.push({
            name: '均匀度',
            tempData: evennessTemp
          })
          deviceTestData.testData.push({
            name: '波动度',
            tempData: fluctuationTemp
          })
          deviceTestData.testData.push({
            name: '上偏差',
            tempData: deviationTempSup
          })
          deviceTestData.testData.push({
            name: '下偏差',
            tempData: deviationTempSub
          })
          deviceTestData.updateTime = dataLen === 0 ? '' : ele.data['time'][dataLen - 1]
          deviceTestData.packNumber = dataLen
          deviceTestData.temps = this.prepareGraphData('温度', 'temp', ele.data)
          deviceTestDatas.push(deviceTestData)
        }
      })
      return deviceTestDatas
    },
    DeviceTestDataTable () {
      const equipments = this.equipments
      let deviceTestDataTable = []
      equipments.forEach((ele, index, equipments) => {
        let packCount = ele.data['evennessTemp'].length
        if (ele.device.detectProperty === '温湿度') {
          let deviceTestData = {'tempTestDataTable': [], 'humiTestDataTable': []}
          deviceTestData.equipment = ele.device
          // 构建数据表格中规则的行列数据
          let tempdeviations = []
          let humideviations = []
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            let rowHumi = {}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              rowTemp[key] = ele.data[id]['temp'][i]
              rowHumi[key] = ele.data[id]['humi'][i]
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['averageTemp'] = ele.data['averageTemp'][i]
            tempdeviations.push(rowTemp['deviation'])
            // 湿度数据构建
            rowHumi['count'] = i + 1
            rowHumi['averageHumi'] = ele.data['averageHumi'][i]
            humideviations.push(rowHumi['deviation'])
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
            deviceTestData.humiTestDataTable.push(rowHumi)
          }
          deviceTestData.ids = ele.data['IDS'].slice()
          // comment
          deviceTestDataTable.push(deviceTestData)
        } else if (ele.device.detectProperty === '温度') {
          let deviceTestData = {'tempTestDataTable': []}
          deviceTestData.equipment = ele.device
          // 构建数据表格中规则的行列数据
          let tempdeviations = []
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              rowTemp[key] = ele.data[id]['temp'][i]
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['averageTemp'] = ele.data['averageTemp'][i]
            tempdeviations.push(rowTemp['deviation'])
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
          }
          deviceTestData.ids = ele.data['IDS'].slice()
          // comment
          deviceTestDataTable.push(deviceTestData)
        }
      })
      return deviceTestDataTable
    },
    showMessageState () {
      return (this.equipments.length === 0) && !this.isOnTest
    }
  },
  methods: {
    // ...mapActions(['']),
    prepareGraphData (title, key, sensorData) {
      let data = template()
      data.title.text = title
      data.legend.data = sensorData.IDS.map((id) => {
        return `ID${id}`
      })
      data.xAxis.data = sensorData.time.slice()
      let series = []
      data.legend.data.forEach((id, index, ids) => {
        let sensorSerie = {
          name: id,
          type: 'line',
          data: sensorData[id.slice(2)][key].slice()
        }
        series.push(sensorSerie)
      })
      data.series = series
      return data
    }
  }
}
</script>

<style>
.dashboard{
}

.dashboard .main-page-container{
  padding-left: 0;
  padding-right: 0;
}

.saveData {
  position: fixed;
  top: 1.2rem;
  right: 4rem;
  z-index: 1005;
}

.dash-test-item{
  padding-top: 1rem;
}

.dash-test-item > h4{
  text-align: center;
  padding-bottom: 1rem;
  font-size: 1.4rem;
  color: #707377;
}

.dash-test-item .test-item-chart{
  height: 47rem;
}

.dash-test-item .test-item-data{
  height: 47rem;
  overflow: auto;
}

.dash-test-item .test-item-col{
  text-align: center;
}

</style>
