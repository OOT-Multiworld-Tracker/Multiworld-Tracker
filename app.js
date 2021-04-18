/**
 * @type{import('./src/networking/auto_tracker')}
 */
const AutoTracker = new (require('./src/networking/auto_tracker'))()
AutoTracker.Initalize() // Initalize the emulator-linked auto tracker.

const WebServer = new (require('./src/renderer/webserver'))()

/**
 * @type{import('./src/renderer/electron')}
 */
const Electron = new (require('./src/renderer/electron'))()

AutoTracker.on('data', (data) => {
  Electron.SendData(data)
})
