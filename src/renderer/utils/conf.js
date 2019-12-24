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
  storage.set('config', config, function (error) {
    if (error) console.log(error)
  })
  storage.set('testTemplate', testTemplate, function (error) {
    if (error) console.log(error)
  })
}
