const WebSocket = require('ws')
const EventEmitter = require('events')

class AutoTracker extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     */
    this.Connect()
  }

  Connect () {
    this.socket = new WebSocket(`ws://localhost:${process.argv[2] || 8080}`)
    this.socket.onerror = () => { console.log('Failed to connect to client') }
    this.socket.onclose = () => { console.log('Disconnected from client'); setTimeout(() => this.Connect(), 10000); this.emit('tracker status', false) }
    this.socket.on('open', _ => {
      console.log('Connected to auto-tracker')
      this.socket.send(JSON.stringify({ PAYLOAD: 0 }))
      this.emit('tracker status', true)
    })
    this.socket.on('message', (data) => { this.emit('data', String(data)) })
  }

  Send (data) {
    const json = JSON.parse(data)
    this.socket.send(JSON.stringify({ PAYLOAD: 2, data: json }))
  }
}

module.exports = AutoTracker
