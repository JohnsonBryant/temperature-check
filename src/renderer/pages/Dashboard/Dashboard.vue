<template>
<div class="dashboard main-page">
  <div class="main-title top-bar">
    <span class="item">实时监测</span>
  </div>
  <div class="main-page-container" >
    <template v-if="showMessageState">
      <container :DeviceTestData=demo.DeviceTestData :deviceTestDataTable=demo.deviceTestDataTable />
    </template>

    <template v-for="(item,index) in DeviceTestDatas" >
      <container :DeviceTestData=item :deviceTestDataTable=DeviceTestDataTable[index] :key="index" />
    </template>
  </div>
</div>
</template>

<script>
import {mapState
  // , mapActions
} from 'vuex'
import TestItemTH from './TestItemTH'
import Container from './Container'
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
        return value.max
      },
      min: function (value) {
        return value.min
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
    'container': Container
  },
  data () {
    return {
      demo: demo,
      dataShowIndex: 1
    }
  },
  computed: {
    ...mapState(['isOnTest', 'equipments']),
    DeviceTestDatas () {
      const equipments = this.equipments
      let deviceTestDatas = []
      equipments.forEach((ele, index, equipments) => {
        let dataLen = ele.data['time'].length
        let deviceTestData = {
          'equipment': ele.device,
          'data': ele.data,
          'updateTime': '',
          'packNumber': 0
        }
        deviceTestData.updateTime = dataLen === 0 ? '' : ele.data['time'][dataLen - 1]
        deviceTestData.packNumber = dataLen
        if (ele.device.detectProperty === '温湿度') {
          Object.assign(deviceTestData, { 'temp': {}, 'humi': {} })
          deviceTestData.temp = this.prepareGraphData('温度', 'temp', ele.data)
          deviceTestData.humi = this.prepareGraphData('湿度', 'humi', ele.data)
        } else if (ele.device.detectProperty === '温度') {
          Object.assign(deviceTestData, { 'temp': {} })
          deviceTestData.temp = this.prepareGraphData('温度', 'temp', ele.data)
        }
        deviceTestDatas.push(deviceTestData)
      })
      return deviceTestDatas
    },
    DeviceTestDataTable () {
      const equipments = JSON.parse(JSON.stringify(this.equipments))
      let deviceTestDataTable = []
      equipments.forEach((ele, index, equipments) => {
        let packCount = ele.data['time'].length
        let deviceTestData = {
          'ids': ele.config['IDS'].slice(),
          'equipment': ele.device
        }
        if (ele.device.detectProperty === '温湿度') {
          Object.assign(deviceTestData, {
            'testData': this.testDataTH(),
            'tempTestDataTable': [],
            'humiTestDataTable': [],
            'dataTableHeader': []
          })
          // 构建数据表格中规则的行列数据
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            let rowHumi = {}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              rowTemp[key] = ele.data[id]['temp'][i].toFixed(2)
              rowHumi[key] = ele.data[id]['humi'][i].toFixed(2)
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['average'] = ele.data['averageTemp'][i]
            // 湿度数据构建
            rowHumi['count'] = i + 1
            rowHumi['average'] = ele.data['averageHumi'][i]
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
            deviceTestData.humiTestDataTable.push(rowHumi)
          }
          // 添加最大值最小值行
          let addonsTemp = packCount === 0 ? [{'count': '最大值', 'average': ''}, {'count': '最小值', 'average': ''}]
            : [{'count': '最大值', 'average': this.max(ele.data['averageTemp']).toFixed(2)}, {'count': '最小值', 'average': this.min(ele.data['averageTemp']).toFixed(2)}]
          let addonsHumi = packCount === 0 ? [{'count': '最大值', 'average': ''}, {'count': '最小值', 'average': ''}]
            : [{'count': '最大值', 'average': this.max(ele.data['averageHumi']).toFixed(2)}, {'count': '最小值', 'average': this.min(ele.data['averageHumi']).toFixed(2)}]
          ele.config['IDS'].forEach((id, index, ids) => {
            addonsTemp[0][id] = packCount === 0 ? '' : this.max(ele.data[id]['temp']).toFixed(2)
            addonsTemp[1][id] = packCount === 0 ? '' : this.min(ele.data[id]['temp']).toFixed(2)
            addonsHumi[0][id] = packCount === 0 ? '' : this.max(ele.data[id]['humi']).toFixed(2)
            addonsHumi[1][id] = packCount === 0 ? '' : this.min(ele.data[id]['humi']).toFixed(2)
          })
          deviceTestData.tempTestDataTable.sort((a, b) => b.count - a.count)
          deviceTestData.humiTestDataTable.sort((a, b) => b.count - a.count)
          deviceTestData.tempTestDataTable.splice(0, 0, ...addonsTemp)
          deviceTestData.humiTestDataTable.splice(0, 0, ...addonsHumi)
          // 计算数据表格表头
          let dataTableHeader = deviceTestData.dataTableHeader
          let ids = ele.data['IDS']
          for (let i = 0; i < ids.length; i++) {
            let item = {'key': `${ids[i]}`, 'prop': `${ids[i]}`}
            dataTableHeader.push(item)
          }
          // 绑定最终计算数据表格
          deviceTestData.testData[0].temp = parseFloat(ele.config.temp).toFixed(2)
          deviceTestData.testData[1].temp = ele.data['deviationTempSup']
          deviceTestData.testData[2].temp = ele.data['deviationTempSub']
          deviceTestData.testData[3].temp = ele.data['evennessTemp']
          deviceTestData.testData[4].temp = ele.data['fluctuationTemp']
          deviceTestData.testData[0].humi = parseFloat(ele.config.humi).toFixed(2)
          deviceTestData.testData[1].humi = ele.data['deviationHumiSup']
          deviceTestData.testData[2].humi = ele.data['deviationHumiSub']
          deviceTestData.testData[3].humi = ele.data['evennessHumi']
          deviceTestData.testData[4].humi = ele.data['fluctuationHumi']
          // comment
          deviceTestDataTable.push(deviceTestData)
        } else if (ele.device.detectProperty === '温度') {
          Object.assign(deviceTestData, {
            'testData': this.testDataTemp(),
            'tempTestDataTable': [],
            'dataTableHeader': []
          })
          // 构建数据表格中规则的行列数据
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              rowTemp[key] = ele.data[id]['temp'][i].toFixed(2)
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['average'] = ele.data['averageTemp'][i]
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
          }
          // 添加最大值最小值行
          let addonsTemp = packCount === 0 ? [{'count': '最大值', 'average': ''}, {'count': '最小值', 'average': ''}]
            : [{'count': '最大值', 'average': this.max(ele.data['averageTemp']).toFixed(2)}, {'count': '最小值', 'average': this.min(ele.data['averageTemp']).toFixed(2)}]
          ele.config['IDS'].forEach((id, index, ids) => {
            addonsTemp[0][id] = packCount === 0 ? '' : this.max(ele.data[id]['temp']).toFixed(2)
            addonsTemp[1][id] = packCount === 0 ? '' : this.min(ele.data[id]['temp']).toFixed(2)
          })
          deviceTestData.tempTestDataTable.sort((a, b) => b.count - a.count)
          deviceTestData.tempTestDataTable.splice(0, 0, ...addonsTemp)
          // 计算数据表格表头
          let dataTableHeader = deviceTestData.dataTableHeader
          let ids = ele.data['IDS']
          for (let i = 0; i < ids.length; i++) {
            let item = {'key': `${ids[i]}`, 'prop': `${ids[i]}`}
            dataTableHeader.push(item)
          }
          // 绑定最终计算数据表格
          deviceTestData.testData[0].temp = parseFloat(ele.config.temp).toFixed(2)
          deviceTestData.testData[1].temp = ele.data['deviationTempSup']
          deviceTestData.testData[2].temp = ele.data['deviationTempSub']
          deviceTestData.testData[3].temp = ele.data['evennessTemp']
          deviceTestData.testData[4].temp = ele.data['fluctuationTemp']
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
    testDataTemp () {
      return [
        { 'param': '设定值', 'temp': '' },
        { 'param': '上偏差', 'temp': '' },
        { 'param': '下偏差', 'temp': '' },
        { 'param': '均匀度', 'temp': '' },
        { 'param': '波动度', 'temp': '' }
      ]
    },
    testDataTH () {
      return [
        { 'param': '设定值', 'temp': '', 'humi': '' },
        { 'param': '上偏差', 'temp': '', 'humi': '' },
        { 'param': '下偏差', 'temp': '', 'humi': '' },
        { 'param': '均匀度', 'temp': '', 'humi': '' },
        { 'param': '波动度', 'temp': '', 'humi': '' }
      ]
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
    },
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
