const WebSocket = require('ws')
const EventEmitter = require('events')

class AutoTracker extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     */
    this.socket = new WebSocket('ws://localhost:8080')
  }

  Send (data) {
    const json = JSON.parse(data)
    json.PAYLOAD = 2
    this.socket.send(JSON.stringify(json))
  }

  Initalize () {
    this.socket.on('open', () => {
      console.log('Connected to auto-tracker')
      this.socket.send(JSON.stringify({ PAYLOAD: 0 }))
    })

    this.socket.on('message', (data) => {
      console.log(data)
      this.emit('data', data)
    })
  }
}

module.exports = AutoTracker
