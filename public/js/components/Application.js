import React, {Component} from 'react'
import app from '../app'
import ModalLayer from './ModalLayer'
import SaveModal from './Modals/SaveModal'
import CreateSaveModal from './Modals/CreateSaveModal'
import ItemModal from './Modals/ItemModal'
import Sidebar from './Sidebar/Sidebar'
import { init, ErrorBoundary } from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import SpoilerModal from './Modals/LoadSpoiler'
import Parser from '../classes/Parser'
import LanguageContext from '../components/LanguageContext'

import '../../css/global.css'
import Window from './Window/Window'
import MainWindow from './Locations/MainWindow'
import LoginModal from './Modals/LoginModal'
import Toast from './Toasts/Toast'
import ToastManager from './Toasts/ToastManager'
import { GameWorld } from '../classes/GameWorld'
import { GetTranslation } from '../classes/Translator'

init({
  dsn: 'https://8957f94163d144e1b2efc135a8a2be1e@o174553.ingest.sentry.io/6000676',
  integrations: [new Integrations.BrowserTracing()],
  release: 'ocarina-of-time-multiworld@v' + process.env.npm_package_version,
  environment: process.env.NODE_ENV,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

export default class Application extends Component {
  constructor () {
    super()

    this.state = { 
      world: app.local.world,
      dropdown: false,
      display: 0,
      saves: []
    }

    this.language = {
      language: 'en_us',
      languageChange: (e) => { this.language.language = e.target.value; this.forceUpdate();},
      i: (key) => { return GetTranslation(this.language.language, key) }
    }

    this.handleModal = this.handleModal.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleSetItem = this.handleSetItem.bind(this)
    this.handleSidebarModal = this.handleSidebarModal.bind(this)
    this.handleCreateSave = this.handleCreateSave.bind(this)
    this.handleSaveCreated = this.handleSaveCreated.bind(this)
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleWindowClick = this.handleWindowClick.bind(this)
    this.handleSpoiler = this.handleSpoiler.bind(this)
    this.handleLoadSpoiler = this.handleLoadSpoiler.bind(this)
    this.handleLogin =  this.handleLogin.bind(this)

    this.selectedLocation = 0
    this.selectedSave = 0

    app.subscribe('account', () => { this.setState({ display: 0 }) })
  }

  handleModal (e) {
    this.setState({ display: 0 })
  }

  handleDropdown (id) {
    switch (id) {
      case 0:
        this.setState({ display: 1 })
        break
      case 1:
        app.local.world.locations.Array()[this.selectedLocation].useless = !app.local.world.locations.Array()[this.selectedLocation].useless
        break
      case 2:
        app.local.world.locations.Array()[this.selectedLocation].important = !app.local.world.locations.Array()[this.selectedLocation].important
        break
    }

    app.call('locations update')
  }
  
  handleLogin (e) {
    this.setState({ display: 5 })
  }

  handleSidebarModal (e, name) {
    this.selectedSave = name
    this.setState({ display: 2 })
  }

  handleCreateSave (e) {
    this.setState({ display: 3 })
  }

  handleSaveCreated (e) {
    this.setState({ saves: Object.keys(localStorage) })
    this.handleModal(e)
  }

  handleContextMenu (e, id) {
    this.selectedLocation = id
    this.setState({ dropdown: true })
  }

  handleWindowClick (e) {
    e.stopPropagation()
    this.setState({ dropdown: false })
  }

  handleSpoiler (e) {
    $.getJSON(URL.createObjectURL(e.target.files[0]), (data) => {
      const log = Parser.ParseSpoiler(data, app)
      this.log = log
      this.setState({ display: 4 })
    })
  }

  handleLoadSpoiler (e, options) {
    app.worlds = this.log.worlds
    if (!app.worlds[0]) app.worlds = [new GameWorld(app)];
    app.global.settings = this.log.settings

    if (!options.dungeons) app.worlds[0].dungeons = [{ name: 'Deku Tree', mq: false }, { name: "Dodongo's Cave", mq: false }, { name: 'Bottom of the Well', mq: false }, { name: "Jabu Jabu's Belly", mq: false }, { name: 'Forest Temple', mq: false }, { name: 'Fire Temple', mq: false }, { name: 'Water Temple', mq: false }, { name: 'Shadow Temple', mq: false }, { name: 'Spirit Temple', mq: false }, { name: 'Ice Cavern', mq: false }, { name: 'GTG', mq: false }, { name: "Ganon's Castle", mq: false }]

    if (options.automark) {
      app.worlds.forEach((world) => {
        world.locations.Array().forEach((locale) => {
          if (this.log.log.settings.disabled_locations.includes(locale.name)) locale.completed = true
        })
      })
    }

    app.local.world = app.worlds[0]
    $('#spoiler').value = null
    this.handleModal(e)
    this.setState({ world: app.local.world, locations: app.local.world.locations })
  }

  getModal () {
    switch (this.state.display) {
      case 1:
        return <ItemModal onItemSet={this.handleSetItem} location={this.selectedLocation} />
      case 2:
        return <SaveModal onSaveLoad={this.handleModal} save={this.selectedSave} />
      case 3:
        return <CreateSaveModal onSave={this.handleSaveCreated} />
      case 4:
        return <SpoilerModal onSaveLoad={this.handleLoadSpoiler} log={this.log} />
      case 5:
        return <LoginModal onLogin={this.handleLogin}/>
    }
  }

  handleSetItem (e) {
    this.handleModal(e)
    app.call('locations update')
  }

  render () {
    if (app.global.settings.popout) return <Window onClick={this.handleWindowClick}><MainWindow dropDownOpen={this.state.dropdown} onContextMenu={this.handleContextMenu} onDropdownClick={this.handleDropdown} /></Window>
    return (
      <LanguageContext.Provider value={this.language}>
        <Window onClick={this.handleWindowClick}>
          <ModalLayer onOutsideClick={this.handleModal} display={this.state.display > 0}>
            {this.getModal()}
          </ModalLayer>
          <ToastManager />
          <Sidebar onSave={this.handleCreateSave} onLogin={this.handleLogin} onSpoilerUpload={this.handleSpoiler} onModal={this.handleSidebarModal} saves={this.state.saves} />
          <MainWindow dropDownOpen={this.state.dropdown} onContextMenu={this.handleContextMenu} onDropdownClick={this.handleDropdown} />
        </Window>
    </LanguageContext.Provider>
    )
  }
}
