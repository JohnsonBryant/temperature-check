export default {
  DeviceTestData: {
    equipment: {
      company: 'XX单位',
      em: 'XX公司',
      deviceName: '温湿度检测仪',
      deviceType: 'GH-100',
      deviceID: '01-001',
      id: 1,
      detectProperty: '温湿度'
    },
    ids: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    updateTime: '2019-12-31 12:59:59',
    packNumber: 15,
    temp: {
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
        data: ['ID1', 'ID2', 'ID3', 'ID4', 'ID5', 'ID6', 'ID7', 'ID8', 'ID9']
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
        data: ['10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09', '10:10', '10:11', '10:12', '10:13', '10:14', '10:15']
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
          data: [37.05, 37.02, 37.03, 37.03, 37.03, 37.03, 37.03, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05]
        },
        {
          name: 'ID2',
          type: 'line',
          data: [37.02, 37.02, 37.02, 36.85, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02, 37.02]
        },
        {
          name: 'ID3',
          type: 'line',
          data: [37.05, 37.02, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05]
        },
        {
          name: 'ID4',
          type: 'line',
          data: [37.10, 37.02, 37.10, 37.10, 37.10, 37.10, 37.11, 37.12, 37.13, 37.14, 37.15, 37.16, 37.17, 37.18, 37.19]
        },
        {
          name: 'ID5',
          type: 'line',
          data: [37.12, 37.02, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12, 37.12]
        },
        {
          name: 'ID6',
          type: 'line',
          data: [37.05, 37.02, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05, 37.05]
        },
        {
          name: 'ID7',
          type: 'line',
          data: [37.06, 37.02, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06]
        },
        {
          name: 'ID8',
          type: 'line',
          data: [37.06, 37.02, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06]
        },
        {
          name: 'ID9',
          type: 'line',
          data: [37.06, 37.02, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06, 37.06]
        }
      ]
    },
    humi: {
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
        data: ['ID1', 'ID2', 'ID3', 'ID4', 'ID5', 'ID6', 'ID7', 'ID8', 'ID9']
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
        data: ['10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09', '10:10', '10:11', '10:12', '10:13', '10:14', '10:15']
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
          data: [60.00, 60.02, 60.03, 60.04, 60.05, 60.06, 60.07, 60.08, 60.09, 60.10, 60.11, 60.12, 60.13, 60.14, 60.15]
        },
        {
          name: 'ID2',
          type: 'line',
          data: [59.85, 59.89, 59.93, 59.97, 60.01, 60.05, 60.09, 60.13, 60.17, 60.21, 60.25, 60.29, 60.33, 60.37, 60.41]
        },
        {
          name: 'ID3',
          type: 'line',
          data: [59.70, 59.79, 59.88, 59.97, 60.06, 60.15, 60.24, 60.33, 60.42, 60.51, 60.60, 60.69, 60.78, 60.87, 60.96]
        },
        {
          name: 'ID4',
          type: 'line',
          data: [59.55, 60.02, 60.03, 60.04, 60.05, 60.06, 60.07, 60.08, 60.09, 60.10, 60.11, 60.12, 60.13, 60.14, 60.15]
        },
        {
          name: 'ID5',
          type: 'line',
          data: [59.40, 60.02, 60.03, 60.04, 60.05, 60.06, 60.07, 60.08, 60.09, 60.10, 60.11, 60.12, 60.13, 60.14, 60.15]
        },
        {
          name: 'ID6',
          type: 'line',
          data: [59.25, 59.35, 59.45, 59.55, 59.65, 59.75, 59.85, 59.95, 60.05, 60.15, 60.25, 60.35, 60.45, 60.55, 60.65]
        },
        {
          name: 'ID7',
          type: 'line',
          data: [59.40, 59.44, 59.48, 59.52, 59.56, 59.60, 59.64, 59.68, 59.72, 59.76, 59.80, 59.84, 59.88, 59.92, 59.96]
        },
        {
          name: 'ID8',
          type: 'line',
          data: [58.95, 58.90, 58.85, 58.80, 58.75, 58.70, 58.65, 58.60, 58.55, 58.50, 58.45, 58.40, 58.35, 58.30, 58.25]
        },
        {
          name: 'ID9',
          type: 'line',
          data: [58.80, 58.85, 58.90, 58.95, 59.00, 59.05, 59.10, 59.15, 59.20, 59.25, 59.30, 59.35, 59.40, 59.45, 59.50]
        }
      ]
    },
    data: {
      1: {
        temp: [],
        humi: [],
        batt: [100]
      },
      2: {
        temp: [],
        humi: [],
        batt: [100]
      },
      3: {
        temp: [],
        humi: [],
        batt: [100]
      },
      4: {
        temp: [],
        humi: [],
        batt: [100]
      },
      5: {
        temp: [],
        humi: [],
        batt: [100]
      },
      6: {
        temp: [],
        humi: [],
        batt: [100]
      },
      7: {
        temp: [],
        humi: [],
        batt: [100]
      },
      8: {
        temp: [],
        humi: [],
        batt: [100]
      },
      9: {
        temp: [],
        humi: [],
        batt: [100]
      },
      IDS: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  deviceTestDataTable: {
    equipment: {
      company: 'XX单位',
      em: 'XX公司',
      deviceName: '温湿度检测仪',
      deviceType: 'GH-100',
      deviceID: '01-001',
      id: 1,
      detectProperty: '温湿度'
    },
    ids: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tempTestDataTable: [
      {'count': '1', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '2', 'average': '0.00', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '3', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '4', 'average': '0.27', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '5', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '6', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '7', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '8', 'average': '0.10', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '9', 'average': '0.11', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '10', 'average': '0.12', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '11', 'average': '0.13', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '12', 'average': '0.14', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '13', 'average': '0.15', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '14', 'average': '0.16', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '15', 'average': '0.17', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '最大值', 'average': '0.27', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '最小值', 'average': '0.00', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''}
    ],
    humiTestDataTable: [
      {'count': '1', 'average': '1.20', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '2', 'average': '1.17', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '3', 'average': '1.18', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '4', 'average': '1.24', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '5', 'average': '1.31', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '6', 'average': '1.45', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '7', 'average': '1.59', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '8', 'average': '1.73', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '9', 'average': '1.87', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '10', 'average': '2.01', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '11', 'average': '2.15', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '12', 'average': '2.29', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '13', 'average': '2.43', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '14', 'average': '2.57', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '15', 'average': '2.71', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '最大值', 'average': '2.71', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''},
      {'count': '最小值', 'average': '1.36', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''}
    ],
    dataTableHeader: [
      {'key': '1', 'prop': '1'},
      {'key': '2', 'prop': '2'},
      {'key': '3', 'prop': '3'},
      {'key': '4', 'prop': '4'},
      {'key': '5', 'prop': '5'},
      {'key': '6', 'prop': '6'},
      {'key': '7', 'prop': '7'},
      {'key': '8', 'prop': '8'},
      {'key': '9', 'prop': '9'}
    ],
    testData: [
      { 'param': '设定值', 'temp': '37.0', 'humi': '60.0' },
      { 'param': '上偏差', 'temp': '0.19', 'humi': '0.96' },
      { 'param': '上偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）', 'humi': 'U=1.3%RH （k=2）' },
      { 'param': '下偏差', 'temp': '-0.15', 'humi': '-1.75' },
      { 'param': '下偏差校准不确定度', 'temp': 'U=0.2℃  （k=2）', 'humi': 'U=1.3%RH （k=2）' },
      { 'param': '均匀度', 'temp': '0.12', 'humi': '1.79' },
      { 'param': '波动度', 'temp': '0.13', 'humi': '1.36' }
    ]
  }
}
