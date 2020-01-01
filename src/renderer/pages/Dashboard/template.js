export default {
  equipment: {
    company: 'XX单位',
    em: 'XX公司',
    deviceName: '温湿度检测仪',
    deviceType: 'GH-100',
    deviceID: '01-001',
    id: 1
  },
  updateTime: '2019-12-31 12:59:59',
  testData: [
    {name: '1' + '-电量100%', tempData: 'xx.xx', humiData: 'xx.xx'},
    {name: '2' + '-电量100%', tempData: 'xx.xx', humiData: 'xx.xx'},
    {name: '3' + '-电量100%', tempData: 'xx.xx', humiData: 'xx.xx'},
    {name: '均匀度：', tempData: 'xx.xx', humiData: 'xx.xx'},
    {name: '波动度：', tempData: 'xx.xx', humiData: 'xx.xx'},
    {name: '偏差：', tempData: 'xx.xx', humiData: 'xx.xx'}
  ],
  temps: {
    title: {
      text: '温度',
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
      data: ['ID1', 'ID2', 'ID3']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['10:01', '10:02', '10:03']
    },
    yAxis: {
      type: 'value',
      max: function (value) {
        return value.max + (value.max - value.min) * 0.1
      },
      min: function (value) {
        return value.min - (value.max - value.min) * 0.1
      }
    },
    series: [
      {
        name: 'ID1',
        type: 'line',
        data: [20.5, 21.5, 19.8]
      },
      {
        name: 'ID2',
        type: 'line',
        data: [18.5, 17.5, 16.5]
      },
      {
        name: 'ID3',
        type: 'line',
        data: [16.3, 17.2, 15.9]
      }
    ]
  },
  humis: {
    title: {
      text: '湿度',
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
      data: ['ID1', 'ID2', 'ID3']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['10:01', '10:02', '10:03']
    },
    yAxis: {
      type: 'value',
      max: function (value) {
        return value.max + (value.max - value.min) * 0.1
      },
      min: function (value) {
        return value.min - (value.max - value.min) * 0.1
      }
    },
    series: [
      {
        name: 'ID1',
        type: 'line',
        data: [50.65, 54.35, 51.35]
      },
      {
        name: 'ID2',
        type: 'line',
        data: [48.65, 50.35, 49.35]
      },
      {
        name: 'ID3',
        type: 'line',
        data: [51.65, 55.35, 53.35]
      }
    ]
  }
}
