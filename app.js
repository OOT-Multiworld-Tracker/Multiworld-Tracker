/**
 * @type{import('./public/networking/auto_tracker')}
 */
const AutoTracker = new (require('./js/networking/auto_tracker'))()
//AutoTracker.Initalize() // Initalize the emulator-linked auto tracker.

const WebServer = new (require('./js/renderer/webserver'))()

/**
 * @type{import('./public/renderer/electron')}
 */
const Electron = process.type ? new (require('./js/renderer/electron'))() : { on: () => {} }

Electron.on('data', (data) => {
  AutoTracker.Send(data)
})

AutoTracker.on('tracker status', status => {
  console.log('Tracker connection: ' + status)
  Electron.SendData(JSON.stringify({ payload: 4, data: status }))
})

AutoTracker.on('data', (data) => {
  try {
    Electron.SendData(data)
  } catch (e) {
    console.log(e)
  }
})
