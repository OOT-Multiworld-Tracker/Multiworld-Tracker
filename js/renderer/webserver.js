const express = require('express')
const path = require('path')

class WebServer {
  constructor () {
    this.app = express()
    this.app.use(express.static(path.join(__dirname, '../../public/')))
    this.app.listen(8081)
  }
}

module.exports = WebServer
