'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import MenuBuilder from './menu.js'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let loadingScreen
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 780,
    useContentSize: true,
    width: 1280,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

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
      // mainWindow.maximize()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('close', (event) => {
    let response = dialog.showMessageBox({
      type: 'info',
      title: '提示',
      buttons: ['取消', '确定'],
      cancelId: 0,
      message: '请确保测试数据已保存后，再退出系统！'
    })
    if (response === 0) {
      event.preventDefault()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
}

const createLoadingScreen = () => {
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
    `file://${__dirname}/static/loading.html`
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

  setTimeout(() => {
    createWindow()
  }, 1000)
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
