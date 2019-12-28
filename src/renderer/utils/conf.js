const storage = require('electron-json-storage')

export const initConf = function () {
  let config = {
    'SerialPortName': 'COM9',
    'BaudRate': 115200,
    'BatteryLow': 3.3,
    'BatteryHigh': 7.2
  }

  let testTemplate = {
    'cycle': 2,
    'temp': 20,
    'humi': 50,
    'centerID': 1,
    'IDS': '2,3',
    'isSendding': true
  }

  let appConfig = {
    'title': '温湿度检测系统',
    'asideTitle': 'XX温湿度检测系统'
  }

  storage.has('config', function (error, hasKey) {
    if (error) throw error

    if (hasKey) {
    } else {
      storage.set('config', config, function (error) {
        if (error) console.log(error)
      })
    }
  })

  storage.has('testTemplate', function (error, hasKey) {
    if (error) throw error

    if (hasKey) {
    } else {
      storage.set('testTemplate', testTemplate, function (error) {
        if (error) console.log(error)
      })
    }
  })

  storage.has('appConfig', function (error, hasKey) {
    if (error) throw error

    if (hasKey) {
    } else {
      storage.set('appConfig', appConfig, function (error) {
        if (error) console.log(error)
      })
    }
  })
}
