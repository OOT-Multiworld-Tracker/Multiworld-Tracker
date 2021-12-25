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

export default class Sidebar extends React.Component {
  static contextType = LanguageContext
  constructor (props) {
    super(props)
    this.state = { page: 0 }

    this.handleChange = this.handleChange.bind(this)

    this.pages = [this.homePage()];
  }

  shouldComponentUpdate (_, nextState) {
    if (JSON.stringify(this.state) != JSON.stringify(nextState)) return true

    return false
  }

  componentDidMount () {
    this.pages = [this.homePage(), this.savePage(), null, this.itemPage(), this.settingsPage(), this.accountPage()]
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
        {app.global.connected ? <PlayerList /> : <p>Connect to a tracker to see the player list.</p>}
        <EntranceRandomizer />
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
            {this.renderPage()}
          </div>
        </div>
    )
  }
}
