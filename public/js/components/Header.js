import React, { PureComponent } from 'react'
import app from '../app'
import Electron from 'electron'
import ButtonGroup from './Buttons/ButtonGroup'
import Button from './Buttons/Button'

export default class Header extends PureComponent {
  constructor (props) {
    super(props)

    this.state = { connected: false }
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this)
  }

  handleStatusUpdate(status) {
    this.setState({ connected: status })
    app.global.connected = status;
  }

  componentDidMount () {
    app.subscribeToClientConnection(this.handleStatusUpdate)
  }

  componentWillUnmount () {
    app.unsubscribe('connection', this.handleStatusUpdate)
  }

  render () {
    return (
      <header className='toolbar toolbar-header'>
        <div className='toolbar-actions'>
          <span className='title'>Ocarina of Time - Multiworld Autotracker</span>
          <ButtonGroup align='right'>
            <Button align='right' theme='dark'><span className={app.global.connected ? 'icon icon-check' : 'icon icon-cancel'} /></Button>
            <Button align='right' theme='dark' onClick={() => { app.global.settings.popout = !app.global.settings.popout; Electron.ipcRenderer.send('packets', 'popout') }}>P</Button>
            <Button align='right' theme='dark' onClick={() => Electron.ipcRenderer.send('packets', 'minimize')}><span className='icon icon-minus' /></Button>
            <Button align='right' theme='dark' onClick={() => Electron.ipcRenderer.send('packets', 'window_size')}><span className='icon icon-doc' /></Button>
            <Button align='right' theme='dark' onClick={() => Electron.ipcRenderer.send('packets', 'close')}><span className='icon icon-cancel' /></Button>
          </ButtonGroup>
        </div>
      </header>
    )
  }
}
