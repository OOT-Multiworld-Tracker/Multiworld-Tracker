const { app, BrowserWindow, ipcMain } = require('electron')
const EventEmitter = require('events')
const { autoUpdater } = require('electron-updater')

class ElectronRenderer extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     * @type {BrowserWindow}
     */
    this.window = null

    app.whenReady().then(() => {
      this.CreateWindow()

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.CreateWindow()
        }
      })
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  /**
   * Create an 800x600 browser window and load a default file (index.html)
   */
  CreateWindow () {
    this.window = new BrowserWindow({
      width: 1024,
      height: 748,
      frame: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    })

    ipcMain.on('packets', (e, data) => {
      if (data === 'close') {
        return this.window.close()
      } else if (data === 'window_size') {
        return this.window.isMaximized ? this.window.maximize() : this.window.unmaximize()
      } else if (data === 'minimize') {
        return this.window.minimize()
      }

      this.emit('data', data)
    })

    this.LoadUpdater()
    autoUpdater.checkForUpdates()

    autoUpdater.on('update-not-available', () => {
      console.log('Client up to date')
      this.LoadWindow('index.html')
    })

    autoUpdater.on('error', (err) => {
      console.log('Error: ' + err)
      this.LoadWindow('index.html')
    })

    autoUpdater.on('download-progress', (progress) => {
      this.SendData(`${progress.bytesPerSecond} - ${progress.percent}%`)
    })

    autoUpdater.on('update-downloaded', _ => {
      console.log('Update complete')
      autoUpdater.quitAndInstall()
    })
  }

  LoadUpdater () {
    this.window.loadFile('public/update.html')
  }

  /**
   * Load a file into the browser window from the public directory.
   */
  LoadWindow (file) {
    this.window.loadURL('http://localhost:8081')
  }

  /**
   * Send data to the renderer process
   * @param {*} data
   */
  SendData (data) {
    this.window.webContents.send('packet', data)
  }
}

module.exports = ElectronRenderer
