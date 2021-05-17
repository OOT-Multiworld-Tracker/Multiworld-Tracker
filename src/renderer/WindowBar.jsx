import React, { PureComponent } from 'react'
import './WindowBar.css'

export default class WindowBar extends PureComponent {
  render () {
    return (
      <header className='toolbar toolbar-header'>
        <div className='toolbar-actions'>
          <span className='title'>Ocarina of Time - Multiworld Autotracker</span>
          <div className='btn-group pull-right'>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'minimize')}>
              <span className='icon icon-minus' />
            </button>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'window_size')}>
              <span className='icon icon-doc' />
            </button>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'close')}>
              <span className='icon icon-cancel' />
            </button>
          </div>
        </div>
      </header>
    )
  }
}
