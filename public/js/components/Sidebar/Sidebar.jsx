import React from 'react'
import app, { SaveUtils } from '../../app'
import Saves from '../Saves'
import Items from '../Items'
import Dungeons from '../Dungeon'
import Settings from '../Settings'
import LanguageContext from '../LanguageContext'
import {GetLanguages} from '../../classes/Translator'
import { ErrorBoundary } from '@sentry/react'

import './Sidebar.css'
import PlayerList from './PlayerList'
import SidebarButtons from './SidebarButtons'
import EntranceRandomizer from './EntranceRandomizer'
import Account from './Account'
import LocationHint from './LocationHint'
import GameManager from '../../classes/GameManager'
import { GameWorld } from '../../classes/GameWorld'

export default class Sidebar extends React.Component {
  static contextType = LanguageContext
  constructor (props) {
    super(props)
    this.state = { page: 0, connected: false }

    this.handleChange = this.handleChange.bind(this)

    this.pages = [this.homePage];
  }

  shouldComponentUpdate (_, nextState) {
    if (JSON.stringify(this.state) != JSON.stringify(nextState)) return true

    return false
  }

  componentDidMount () {
    app.subscribeToClientConnection((connected) => {
      this.setState({ connected })
      this.forceUpdate();
    });
    this.pages = [this.homePage, this.savePage, null, this.itemPage, this.settingsPage, this.accountPage]
    app.local.world.subscribeSync(() => {
      this.forceUpdate();
    })
    app.local.world.subscribeChangeScene(() => {
      this.forceUpdate();
    })
  }

  renderPage (props) {
    return this.pages[parseInt(this.state.page)](props);
  }

  handleChange (e) {
    this.setState({ page: e.target.value })
  }

  homePage () {
    return (
      <>
        {app.global.connected ? <PlayerList /> : <p>Connect to a tracker to see the player list.</p>}
        <LocationHint />
        { (app.global.settings.entranceSanity && app.global.settings.entranceSanity.value == true) && <EntranceRandomizer />}
      </>
    )
  }

  savePage () {
    return (
      <>
        <button className='btn btn-dark' style={{ marginBottom: '4px', width: '100%', backgroundColor: 'rgb(113 47 47)' }} onClick={() => SaveUtils.Reset()}>Start Over</button>
        <br />
        <div className='list'>
          <div className='list-header'><span className='location-name'>Files</span> <span onClick={this.props.onSave} className='location-items btn btn-default icon icon-plus' /></div>
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

  settingsPage (props) {
    return (
      <>
        <input type='file' id='spoiler' onChange={ (e) => props.onSpoilerUpload(e) } accept='.json' style={{display: 'none'}} />
        <select className='btn btn-default form-control' style={{width: '100%'}} onChange={(e) => this.context.languageChange(e)}>{GetLanguages().map((lang) => <option key={lang} value={lang}>{lang}</option>)}</select>
        <select className='btn btn-default form-control' value={GameManager.GetSelectedGame().name} style={{width: '100%'}} onChange={(e) => { GameManager.SetSelectedGame(e.target.value); app.worlds = [new GameWorld(app)]; app.local.world = app.worlds[0]; app.global.settings.makeSettings(); app.call('locations update') }}>{GameManager.GetGames().map((game, index) => { console.log(game); return (<option key={index} value={game.name}>{game.name}</option>)})}</select>
        <button className='btn btn-default form-control' style={{width: '100%', borderBottom: '1px solid #555'}} onClick={(e) => $('#spoiler').click()}>Upload Spoiler Log</button>
        <Settings settings={app.global.settings} />
        <hr />
        <Dungeons />
      </>
    )
  }

  accountPage () {
    return (
      <>
        <Account onLogin={this.props.onLogin} />
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
            {this.renderPage(this.props)}
          </div>
        </div>
    )
  }
}
