import React from 'react'
import app, { SaveUtils } from '../app'
import Player from './Player'
import Saves from './Saves'
import Items from './Items'
import Dungeons from './Dungeon'
import Settings from './Settings'
import Worlds from './Worlds'
import Parser from '../classes/Parser'

export class SidebarButtons extends React.Component {
  constructor (props) {
    super(props)
    this.state = { uploaded: false }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onChange(e)
  }

  render () {
    return (
      <select className='form-control' onChange={this.handleChange}>
        <option value='0'>Home</option>
        <option value='1'>Saves</option>
        <option value='3'>Items</option>
        <option value='4'>Settings</option>
        {this.state.uploaded ? <option value='2'>Worlds</option> : <option value='2' disabled>Worlds</option>}
      </select>
    )
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
      app.worlds.map((world, index) => { return <Player key={index} save={world.save} /> })
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

  handleUploadedSpoiler (e) {
    $.getJSON(URL.createObjectURL(e.target.files[0]), (data) => {
      const log = Parser.ParseSpoiler(data, app)
      app.worlds = log.worlds
      app.global.settings = log.settings

      app.local.world = app.worlds[0]
    })
  }

  settingsPage () {
    return (
      <>
        <input type='file' onChange={this.handleUploadedSpoiler} accept=".json" placeholder="Upload Spoiler" />
        <Settings />
        <br />
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
        {this.renderPage()}
      </>
    )
  }
}
