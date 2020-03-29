<template>
<div class="dashboard main-page">
  <div class="main-page-title top-bar">
    <span class="top-bar-item">实时监测</span>
  </div>
  <div class="main-page-container" >
    <template v-if="showMessageState">
      <!-- <div class="warn-text">
        <h4>当前系统未处在测试状态，如需要进行测试，请切换到设备管理页，选择测试设备，启动测试！</h4>
        <h5>以下为测试示例，实际测试效果可参考如下图表！</h5>
      </div> -->
      <test-item-th 
        :equipment="demo.equipment"
        :updateTime="demo.updateTime"
        :temp="demo.temp"
        :humi="demo.humi"
      />
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
            'humiTestDataTable': []
          })
          // 构建数据表格中规则的行列数据
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
            rowTemp['average'] = ele.data['averageTemp'][i]
            // 湿度数据构建
            rowHumi['count'] = i + 1
            rowHumi['average'] = ele.data['averageHumi'][i]
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
            deviceTestData.humiTestDataTable.push(rowHumi)
          }
          // 添加最大值最小值行
          let addonsTemp = [{'count': '最大值', 'average': this.max(ele.data['averageTemp'])}, {'count': '最小值', 'average': this.min(ele.data['averageTemp'])}]
          let addonsHumi = [{'count': '最大值', 'average': this.max(ele.data['averageHumi'])}, {'count': '最小值', 'average': this.min(ele.data['averageHumi'])}]
          ele.config['IDS'].forEach((id, index, ids) => {
            addonsTemp[0][id] = this.max(ele.data[id]['temp'])
            addonsTemp[1][id] = this.min(ele.data[id]['temp'])
            addonsHumi[0][id] = this.max(ele.data[id]['humi'])
            addonsHumi[1][id] = this.min(ele.data[id]['humi'])
          })
          deviceTestData.tempTestDataTable.push(...addonsTemp)
          deviceTestData.humiTestDataTable.push(...addonsHumi)
          // 绑定最终计算数据表格
          deviceTestData.testData[0].temp = ele.config.temp
          deviceTestData.testData[1].temp = ele.data['deviationTempSup']
          deviceTestData.testData[3].temp = ele.data['deviationTempSub']
          deviceTestData.testData[5].temp = ele.data['evennessTemp']
          deviceTestData.testData[6].temp = ele.data['fluctuationTemp']
          deviceTestData.testData[0].humi = ele.config.humi
          deviceTestData.testData[1].humi = ele.data['deviationHumiSup']
          deviceTestData.testData[3].humi = ele.data['deviationHumiSub']
          deviceTestData.testData[5].humi = ele.data['evennessHumi']
          deviceTestData.testData[6].humi = ele.data['fluctuationHumi']
          // comment
          deviceTestDataTable.push(deviceTestData)
        } else if (ele.device.detectProperty === '温度') {
          Object.assign(deviceTestData, {
            'testData': this.testDataTemp(),
            'tempTestDataTable': []
          })
          // 构建数据表格中规则的行列数据
          for (let i = 0; i < packCount; i++) {
            let rowTemp = {}
            ele.data['IDS'].forEach((id) => {
              let key = `${id}`
              rowTemp[key] = ele.data[id]['temp'][i]
            })
            // 温度数据构建
            rowTemp['count'] = i + 1
            rowTemp['average'] = ele.data['averageTemp'][i]
            // 单行数据添加到数据序列
            deviceTestData.tempTestDataTable.push(rowTemp)
          }
          // 添加最大值最小值行
          let addonsTemp = [{'count': '最大值', 'average': this.max(ele.data['averageTemp'])}, {'count': '最小值', 'average': this.min(ele.data['averageTemp'])}]
          ele.config['IDS'].forEach((id, index, ids) => {
            addonsTemp[0][id] = this.max(ele.data[id]['temp'])
            addonsTemp[1][id] = this.min(ele.data[id]['temp'])
          })
          deviceTestData.tempTestDataTable.push(...addonsTemp)
          // 绑定最终计算数据表格
          deviceTestData.testData[0].temp = ele.config.temp
          deviceTestData.testData[1].temp = ele.data['deviationTempSup']
          deviceTestData.testData[3].temp = ele.data['deviationTempSub']
          deviceTestData.testData[5].temp = ele.data['evennessTemp']
          deviceTestData.testData[6].temp = ele.data['fluctuationTemp']
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
        { 'param': '上偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）' },
        { 'param': '下偏差', 'temp': '' },
        { 'param': '下偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）' },
        { 'param': '均匀度', 'temp': '' },
        { 'param': '波动度', 'temp': '' }
      ]
    },
    testDataTH () {
      return [
        { 'param': '设定值', 'temp': '', 'humi': '' },
        { 'param': '上偏差', 'temp': '', 'humi': '' },
        { 'param': '上偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）', 'humi': 'U=1.3%RH （k=2）' },
        { 'param': '下偏差', 'temp': '', 'humi': '' },
        { 'param': '下偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）', 'humi': 'U=1.3%RH （k=2）' },
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
