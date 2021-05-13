/**
 * @type{import('./public/networking/auto_tracker')}
 */
const AutoTracker = new (require('./js/networking/auto_tracker'))()
AutoTracker.Initalize() // Initalize the emulator-linked auto tracker.

const WebServer = new (require('./js/renderer/webserver'))()

/**
 * @type{import('./public/renderer/electron')}
 */
const Electron = process.type ? new (require('./js/renderer/electron'))() : { on: () => {} }

Electron.on('data', (data) => {
  console.log(data)
  AutoTracker.Send(data)
})

AutoTracker.on('data', (data) => {
  Electron.SendData(data)
})
