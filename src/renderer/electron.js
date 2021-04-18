const { app, BrowserWindow } = require('electron')

class ElectronRenderer {
  constructor () {
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
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    })

    this.LoadWindow('index.html')
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
