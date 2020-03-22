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
          let deviationTemp = dataLen === 0 ? '' : ele.data['deviationTemp'][dataLen - 1]
          let deviationHumi = dataLen === 0 ? '' : ele.data['deviationHumi'][dataLen - 1]
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
            name: '偏差',
            tempData: deviationTemp,
            humiData: deviationHumi
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
          let deviationTemp = dataLen === 0 ? '' : ele.data['deviationTemp'][dataLen - 1]
          deviceTestData.testData.push({
            name: '均匀度',
            tempData: evennessTemp
          })
          deviceTestData.testData.push({
            name: '波动度',
            tempData: fluctuationTemp
          })
          deviceTestData.testData.push({
            name: '偏差',
            tempData: deviationTemp
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
        let packCount = ele.data[ele.config.centerID]['temp'].length
        if (ele.device.detectProperty === '温湿度') {
          let deviceTestData = {'tempTestDataTable': [], 'humiTestDataTable': []}
          deviceTestData.equipment = ele.device
          // 构建数据表格中规则的行列数据
          let tempdeviations = []
          let humideviations = []
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            let rowHumi = {}
            let sensorsdata = {temp: [], humi: []}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              if (id === ele.config.centerID) {
                key = `centerID`
              }
              rowTemp[key] = ele.data[id]['temp'][i]
              rowHumi[key] = ele.data[id]['humi'][i]
              sensorsdata.temp.push(ele.data[id]['temp'][i])
              sensorsdata.humi.push(ele.data[id]['humi'][i])
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['max'] = Math.max.call(null, ...sensorsdata.temp) // 一次采集中所有测点数据的最大值
            rowTemp['min'] = Math.min.call(null, ...sensorsdata.temp) // 一次采集中所有测点数据的最小值
            rowTemp['deviation'] = rowTemp['max'] - rowTemp['min'] // 一次采集中所有测点数据的最大值与最小值得差值
            rowTemp['evennessTemp'] = ele.data['evennessTemp'][i] // 均匀度
            rowTemp['fluctuationTemp'] = ele.data['fluctuationTemp'][i] // 波动度
            rowTemp['deviationTemp'] = ele.data['deviationTemp'][i] // 偏差
            rowTemp['basevalue'] = ele.config.temp // 示值
            tempdeviations.push(rowTemp['deviation'])
            // 湿度数据构建
            rowHumi['count'] = i + 1
            rowHumi['max'] = Math.max.call(null, ...sensorsdata.humi)
            rowHumi['min'] = Math.min.call(null, ...sensorsdata.humi)
            rowHumi['deviation'] = rowHumi['max'] - rowHumi['min']
            rowHumi['evennessHumi'] = ele.data['evennessHumi'][i]
            rowHumi['fluctuationHumi'] = ele.data['fluctuationHumi'][i]
            rowHumi['deviationHumi'] = ele.data['deviationHumi'][i]
            rowHumi['basevalue'] = ele.config.humi // 示值
            humideviations.push(rowHumi['deviation'])
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
            deviceTestData.humiTestDataTable.push(rowHumi)
          }
          if (packCount >= 1) {
            // 构建/计算每次采集后的最新结果，均匀度、波动度、偏差，并追加到数据序列
            const average = (values) => { return values.reduce((pre, cur) => { return parseFloat(cur) + parseFloat(pre) }) / values.length }
            let centerTemps = ele.data[ele.config.centerID]['temp'].slice()
            let centerHumis = ele.data[ele.config.centerID]['humi'].slice()
            let tempCenterMax = Math.max.call(null, ...centerTemps)
            let tempCenterMin = Math.min.call(null, ...centerTemps)
            let humiCenterMax = Math.max.call(null, ...centerHumis)
            let humiCenterMin = Math.min.call(null, ...centerHumis)
            let tempcalc = []
            let humicalc = []
            let tempdeviation = ele.config.temp - centerTemps[centerTemps.length - 1]
            let humideviation = ele.config.humi - centerHumis[centerHumis.length - 1]
            tempcalc[0] = {'count': '显示平均值', 'basevalue': ele.config.temp, 'centerID': average(centerTemps)}
            tempcalc[1] = {'count': 'max(0)', 'centerID': tempCenterMax}
            tempcalc[2] = {'count': 'min(0)', 'centerID': tempCenterMin}
            tempcalc[3] = {'count': '温度波动度', 'centerID': (tempCenterMax - tempCenterMin) / 2}
            tempcalc[4] = {'count': '温度偏差', 'centerID': tempdeviation}
            tempcalc[5] = {'count': '均匀度', 'centerID': average(tempdeviations)}
            humicalc[0] = {'count': '显示平均值', 'basevalue': ele.config.humi, 'centerID': average(centerHumis)}
            humicalc[1] = {'count': 'max(0)', 'centerID': humiCenterMax}
            humicalc[2] = {'count': 'min(0)', 'centerID': humiCenterMin}
            humicalc[3] = {'count': '湿度波动度', 'centerID': (humiCenterMax - humiCenterMin) / 2}
            humicalc[4] = {'count': '湿度偏差', 'centerID': humideviation}
            humicalc[5] = {'count': '均匀度', 'centerID': average(humideviations)}
            deviceTestData.tempTestDataTable.push(...tempcalc)
            deviceTestData.humiTestDataTable.push(...humicalc)
          }
          let ids = ele.data['IDS'].slice()
          let centeridIndex = ids.indexOf(ele.config.centerID)
          ids.splice(centeridIndex, 1)
          deviceTestData.ids = ids
          // comment
          deviceTestDataTable.push(deviceTestData)
        } else if (ele.device.detectProperty === '温度') {
          let deviceTestData = {'tempTestDataTable': []}
          deviceTestData.equipment = ele.device
          // 构建数据表格中规则的行列数据
          let tempdeviations = []
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            let sensorsdata = {temp: []}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              if (id === ele.config.centerID) {
                key = `centerID`
              }
              rowTemp[key] = ele.data[id]['temp'][i]
              sensorsdata.temp.push(ele.data[id]['temp'][i])
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['max'] = Math.max.call(null, ...sensorsdata.temp) // 一次采集中所有测点数据的最大值
            rowTemp['min'] = Math.min.call(null, ...sensorsdata.temp) // 一次采集中所有测点数据的最小值
            rowTemp['deviation'] = rowTemp['max'] - rowTemp['min'] // 一次采集中所有测点数据的最大值与最小值得差值
            rowTemp['evennessTemp'] = ele.data['evennessTemp'][i] // 均匀度
            rowTemp['fluctuationTemp'] = ele.data['fluctuationTemp'][i] // 波动度
            rowTemp['deviationTemp'] = ele.data['deviationTemp'][i] // 偏差
            rowTemp['basevalue'] = ele.config.temp // 示值
            tempdeviations.push(rowTemp['deviation'])
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
          }
          if (packCount >= 1) {
            // 构建/计算每次采集后的最新结果，均匀度、波动度、偏差，并追加到数据序列
            const average = (values) => { return values.reduce((pre, cur) => { return parseFloat(cur) + parseFloat(pre) }) / values.length }
            let centerTemps = ele.data[ele.config.centerID]['temp'].slice()
            let tempCenterMax = Math.max.call(null, ...centerTemps)
            let tempCenterMin = Math.min.call(null, ...centerTemps)
            let tempcalc = []
            let tempdeviation = ele.config.temp - centerTemps[centerTemps.length - 1]
            tempcalc[0] = {'count': '显示平均值', 'basevalue': ele.config.temp, 'centerID': average(centerTemps)}
            tempcalc[1] = {'count': 'max(0)', 'centerID': tempCenterMax}
            tempcalc[2] = {'count': 'min(0)', 'centerID': tempCenterMin}
            tempcalc[3] = {'count': '温度波动度', 'centerID': (tempCenterMax - tempCenterMin) / 2}
            tempcalc[4] = {'count': '温度偏差', 'centerID': tempdeviation}
            tempcalc[5] = {'count': '均匀度', 'centerID': average(tempdeviations)}
            deviceTestData.tempTestDataTable.push(...tempcalc)
          }
          let ids = ele.data['IDS'].slice()
          let centeridIndex = ids.indexOf(ele.config.centerID)
          ids.splice(centeridIndex, 1)
          deviceTestData.ids = ids
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
