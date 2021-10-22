const { app, BrowserWindow, ipcMain } = require('electron')
const EventEmitter = require('events')
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

class ElectronRenderer extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     * @type {BrowserWindow}
     */
    this.window = null

    app.whenReady().then(async() => {
      await installExtension(REACT_DEVELOPER_TOOLS)
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
      webPreferences: { contextIsolation: false, nodeIntegration: true }
    })
    
    this.window.openDevTools({mode:'detach'})

    ipcMain.on('packets', (_, data) => {
      if (data.payload === 7) {
        if (!fs.existsSync(process.env.APPDATA + '/Multiworld-Tracker')) fs.mkdirSync(process.env.APPDATA + '/Multiworld-Tracker')
        return fs.writeFileSync(process.env.APPDATA + '/Multiworld-Tracker/locations.json', JSON.stringify(data.LocationList, null, 4))
      } else if (data === 'close') return this.window.close()
      else if (data === 'window_size') return this.window.isMaximized ? this.window.maximize() : this.window.unmaximize()
      else if (data === 'minimize') return this.window.minimize()

      console.log(data)
      this.emit('data', data)
    })

    // Skip the updating within a development environment
    if (process.argv[0].includes('electron')) return this.LoadWindow('index.html')

    this.LoadUpdater() // Load the updater and check for updates

    autoUpdater.on('update-not-available', this.LoadWindow('index.html'))
    autoUpdater.on('error', this.LoadWindow('index.html'))

    autoUpdater.on('download-progress', (progress) => {
      this.SendData(JSON.stringify({ payload: 2, data: { progress: progress.bytesPerSecond, percent: progress.percent } }))
    })

    autoUpdater.on('update-downloaded', async _ => {
      const file = await this.window.getRepresentedFilename()

      if (file === 'index.html') this.SendData({ payload: 2, data: 'update' }) // If it's the main application, tell the window to show update.
      else autoUpdater.quitAndInstall() // Quit and install the update if on the updater.
    })

    setInterval(() => autoUpdater.checkForUpdates(), 600000)
  }

  LoadUpdater () {
    this.window.loadFile('public/update.html')
    autoUpdater.checkForUpdates()
  }

  /**
   * Load a file into the browser window from the public directory.
   */
  LoadWindow (file) {
    if (process.env.NODE_ENV !== 'production') this.window.loadURL('http://localhost:8080/')
    else this.window.loadFile(path.resolve(__dirname, 'public/dist/index.html'))
    autoUpdater.checkForUpdates()
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
