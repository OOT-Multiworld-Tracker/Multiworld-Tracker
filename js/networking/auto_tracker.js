const WebSocket = require('ws')
const EventEmitter = require('events')
const { Client } = require('archipelago.js')

class AutoTracker extends EventEmitter {
  constructor () {
    super()
    /**
     * @private
     */
    this.Connect()
    this.lastState = false;
  }

  Connect () {
    this.socket = new WebSocket(`ws://localhost:8080`)
    this.socket.onerror = () => { console.log('Failed to connect to client') }
    this.socket.onclose = () => { console.log('Disconnected from client'); setTimeout(() => this.Connect(), 10000); if(this.lastState == true) this.emit('tracker status', false); this.lastState = false; }
    this.socket.on('open', _ => {
      console.log('Connected to auto-tracker')
      
      this.socket.send(JSON.stringify({ PAYLOAD: 0 }))
      this.lastState = true;
      this.emit('tracker status', true)
    })
    this.socket.on('message', (data) => { this.emit('data', String(data)) })
  }

  Send (data) {
    // Don't send when it's closed.
    if (this.socket.readyState != 1 || this.lastState == false) return;

    const json = JSON.parse(data)
    this.socket.send(JSON.stringify({ PAYLOAD: 2, data: json }))
  }
}

module.exports = AutoTracker
