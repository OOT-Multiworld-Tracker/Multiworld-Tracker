import React from 'react'
import app, { SaveUtils } from '../app'
import Player from './Player'
import Saves from './Saves'
import Items from './Items'
import Dungeons from './Dungeon'
import Settings from './Settings'
import Worlds from './Worlds'

export class SidebarButtons extends React.Component {
  constructor (props) {
    super(props)
    this.state = { uploaded: false, worldId: app.global.world }
    this.handleChange = this.handleChange.bind(this)

  }

  handleChange (e) {
    this.props.onChange(e)
  }

  render () {
    return (
      <select className='form-control' onChange={this.handleChange}>
        <option value='0'>Worlds</option>
        <option value='1'>Saves</option>
        <option value='3'>Items</option>
        <option value='4'>Settings</option>
      </select>
    )
  }
}

class PlayerList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      worlds: app.worlds
    }

    app.on('world added', (worlds) => {
      console.log('world added')
      this.setState({ worlds })
      this.forceUpdate()
    })
  }

  render () {
    return app.worlds.map((world, index) => { return <Player key={index} current={world.save == app.global.world} world={index} save={world.save} /> })
  }
}

export default class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = { page: 0 }

    this.handleChange = this.handleChange.bind(this)

    this.pages = [this.homePage(), this.savePage(), this.worldPage(), this.itemPage(), this.settingsPage()]
  }

  renderPage () {
    return this.pages[parseInt(this.state.page)]
  }

  handleChange (e) {
    this.setState({ page: e.target.value })
  }

  homePage () {
    return (
      <>
        <PlayerList />
      </>
    )
  }

  savePage () {
    return (
      <>
        <button className='btn btn-dark' style={{ marginBottom: '4px', width: '100%', backgroundColor: 'rgb(113 47 47)' }} onClick={() => SaveUtils.Reset()}>Start Over</button>
        <br />
        <div class='list'>
          <div class='list-header'>Files <span onClick={this.props.onSave} className='btn btn-default icon icon-plus' /></div>
          <div class='list-content'><Saves saves={this.props.saves} onSaveClick={this.props.onModal} /></div>
        </div>
      </>
    )
  }

  itemPage () {
    return (
      <Items />
    )
  }

  settingsPage () {
    return (
      <>
        <input type='file' id='spoiler' onChange={(e) => this.props.onSpoilerUpload(e)} accept='.json' style={{display: 'none'}} />
        <button className='btn btn-default form-control' style={{width: '100%', borderBottom: '1px solid #555'}} onClick={(e) => $('#spoiler').click()}>Upload Spoiler Log</button>
        <Settings settings={app.global.tracker} />
        <hr />
        <Settings settings={app.global.settings} />
        <hr />
        <Dungeons />
      </>
    )
  }

  worldPage () {
    return (
      <Worlds />
    )
  }

  render () {
    return (
      <>
        <SidebarButtons onChange={this.handleChange} />
        <div style={{ overflowY: 'auto', height: '95%' }}>
          {this.renderPage()}
        </div>
      </>
    )
  }
}
