import React, { PureComponent } from 'react'
import './Sidebar.css'

export default class Sidebar extends PureComponent {
  render () {
    return (
      <div className='pane-md sidebar'>
        <div>
          <input type='file' onInput={(elem) => { }} title='Upload Spoiler' />
          <div className='world_id'>World 1</div>
          <p>Dungeons</p>
        </div>
      </div>
    )
  }
}
