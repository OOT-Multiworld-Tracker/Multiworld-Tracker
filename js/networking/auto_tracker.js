const WebSocket = require('ws')
const EventEmitter = require('events')

class AutoTracker extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     */
    this.socket = new WebSocket(`ws://localhost:${process.argv[2]||8080}`)
    this.socket.onerror = () => { console.log('Failed to connect to client') }
  }

  Send (data) {
    const json = JSON.parse(data)
    this.socket.send(JSON.stringify({ PAYLOAD: 2, data: json }))
  }

  Initalize () {
    this.socket.on('open', () => {
      console.log('Connected to auto-tracker')
      this.socket.send(JSON.stringify({ PAYLOAD: 0 }))
    })

    this.socket.on('message', (data) => {
      // console.log(data)
      this.emit('data', data)
    })
  }
}

module.exports = AutoTracker
