import React from 'react'
import app, { SaveUtils } from '../../app'
import Player from '../Player'
import Saves from '../Saves'
import Items from '../Items'
import Dungeons from '../Dungeon'
import Settings from '../Settings'
import LanguageContext from '../LanguageContext'
import {GetLanguages, GetTranslation} from '../../classes/Translator'
import { ErrorBoundary } from '@sentry/react'

import './Sidebar.css'

export class SidebarButtons extends React.Component {
  static contextType = LanguageContext

  render () {
    return (
      <select className='form-control' onChange={this.props.onChange}>
        <option value='0'>{GetTranslation(this.context.language, 'World')}</option>
        <option value='1'>{GetTranslation(this.context.language, 'Saves')}</option>
        <option value='3'>{GetTranslation(this.context.language, 'Items')}</option>
        <option value='4'>{GetTranslation(this.context.language, 'Settings')}</option>
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

    this.handleWorldUpdate = this.handleWorldUpdate.bind(this)
  }

  handleWorldUpdate () {
    this.setState({ worlds: app.worlds })
  }

  componentDidMount () {
    app.subscribeToWorldUpdate(this.handleWorldUpdate)
    app.saveLoad.subscribe('load', this.handleWorldUpdate)
  }

  render () {
    return this.state.worlds.map((world, index) => { 
      return <Player key={index} current={world == app.local.world} world={index} save={world.save} /> 
    })
  }
}

export default class Sidebar extends React.Component {
  static contextType = LanguageContext
  constructor (props) {
    super(props)
    this.state = { page: 0 }

    this.handleChange = this.handleChange.bind(this)

    this.pages = [this.homePage()];
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (JSON.stringify(this.state) != JSON.stringify(nextState)) return true

    return false
  }

  componentDidMount () {
    this.pages = [this.homePage(), this.savePage(), null, this.itemPage(), this.settingsPage()]
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
        <div className='list'>
          <div className='list-header'>Files <span onClick={this.props.onSave} className='btn btn-default icon icon-plus' /></div>
          <div className='list-content'><Saves saves={this.props.saves} onSaveClick={this.props.onModal} /></div>
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
        <select className='btn btn-default form-control' style={{width: '100%'}} onChange={(e) => this.context.languageChange(e)}>{GetLanguages().map((lang) => <option key={lang} value={lang}>{lang}</option>)}</select>
        <button className='btn btn-default form-control' style={{width: '100%', borderBottom: '1px solid #555'}} onClick={(e) => $('#spoiler').click()}>Upload Spoiler Log</button>
        <Settings settings={app.global.settings} />
        <hr />
        <Dungeons />
      </>
    )
  }

  render () {
    return (
        <div className='pane-md' style={{ minWidth: '240px' }}>
          <ErrorBoundary fallback={<p>Sidebar failed to load</p>}>
            <SidebarButtons onChange={(e) => this.handleChange(e)} />
          </ErrorBoundary>
          <div style={{ overflowY: 'auto', height: '95%' }}>
            {this.renderPage()}
          </div>
        </div>
    )
  }
}
