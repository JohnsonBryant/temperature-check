'use strict'

import {
  app,
  dialog,
  // ipcMain,
  BrowserWindow
} from 'electron'
import MenuBuilder from './menu.js'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 770,
    width: 1280,
    show: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenuBarVisibility(false) // 隐藏顶部菜单栏

  // @TODO: Use 'ready-to-show' event
  mainWindow.webContents.on('did-finish-load', () => {
    if (loadingScreen) {
      loadingScreen.close()
    }

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      // mainWindow.maximize() // 启动时最大化窗口，匹配PAD屏幕
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('close', (event) => {
    const response = dialog.showMessageBox({
      type: 'info',
      title: '提示',
      buttons: ['取消', '确定'],
      cancelId: 0,
      message: '请确保测试数据已保存后，再退出系统！'
    })

    event.preventDefault() // 阻止程序关闭

    response.then((result) => {
      // 根据用户操作，决定是否关闭程序
      if (result.response !== 0) {
        // 推送程序关闭消息到前端，并推迟200毫秒后，关闭程序
        mainWindow.webContents.send('applictionExit', 'stopTest')
        setTimeout(() => {
          app.exit()
        }, 200)
      }
    })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
}

let loadingScreen
const loadingScreenUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/static/loading.tml'
  : `file://${__static}/loading.html`
function createLoadingScreen () {
  loadingScreen = new BrowserWindow(
    Object.assign({
      width: 600,
      height: 400,
      frame: false,
      transparent: true
    })
  )
  loadingScreen.setResizable(false)
  loadingScreen.loadURL(
    loadingScreenUrl
  )
  loadingScreen.on('closed', () => {
    loadingScreen = null
  })
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show()
  })
}

app.on('ready', () => {
  createLoadingScreen()

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
