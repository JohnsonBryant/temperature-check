const storage = require('electron-json-storage')

const config = {
  SerialPortName: 'COM9',
  BaudRate: 115200,
  BatteryLow: 3.3,
  BatteryHigh: 7.2
}

const testTemplate = {
  cycle: 2,
  temp: 20,
  humi: 50,
  centerID: 1,
  IDS: '2,3',
  isSendding: true
}

const appConfig = {
  title: '温湿度检测系统',
  asideTitle: 'XX温湿度检测系统'
}

export const initConf = new Promise((resolve, reject) => {
  storage.has('appConfig', function (error, hasKey) {
    if (error) throw error
    if (!hasKey) {
      resolve(0)
    } else {
      resolve(1)
    }
  })
}).then((result) => {
  if (result === 0) {
    return new Promise((resolve, reject) => {
      storage.set('appConfig', appConfig, function (error) {
        if (error) throw error
        console.log('appConfig init done.')
        resolve(1)
      })
    })
  } else {
    return Promise.resolve(1)
  }
}).then(() => {
  return new Promise((resolve, reject) => {
    storage.has('config', function (error, hasKey) {
      if (error) throw error
      if (!hasKey) {
        resolve(0)
      } else {
        resolve(1)
      }
    })
  })
}).then((result) => {
  if (result === 0) {
    return new Promise((resolve, reject) => {
      storage.set('config', config, function (error) {
        if (error) throw error
        resolve(1)
        console.log('config init done.')
      })
    })
  } else {
    return Promise.resolve(1)
  }
}).then(() => {
  return new Promise((resolve, reject) => {
    storage.has('testTemplate', function (error, hasKey) {
      if (error) throw error
      if (!hasKey) {
        resolve(0)
      } else {
        resolve(1)
      }
    })
  })
}).then((result) => {
  if (result === 0) {
    return new Promise((resolve, reject) => {
      storage.set('testTemplate', testTemplate, function (error) {
        if (error) throw error
        resolve(1)
        console.log('testTemplate init done.')
      })
    })
  } else {
    return Promise.resolve(1)
  }
})
