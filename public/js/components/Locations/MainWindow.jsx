import React, { Component } from 'react'
import app from '../../app'
import { List, ListItem } from '../Lists'
import { ErrorBoundary } from '@sentry/react'

import './MainWindow.css'
import MainHeader from './MainHeader'
import LocationDropdown from './LocationDropdown'

export default class MainWindow extends Component {
  constructor (props) {
    super(props)
    this.filter = props.completed || false
    this.showItems = props.showItems || false

    this.state = { 
      search: '', 
      page: 0, 
      scene: -1, 
      dropdown: { }, 
      world: 0, 
      locations: app.local.world.locations.Accessible(false, false  -1)
    }

    this.handleDropdownClick = this.props.onDropdownClick
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleSceneChange = this.handleSceneChange.bind(this)
    this.displaySection = this.displaySection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleLocationClick = this.handleLocationClick.bind(this)
    this.onLocationUpdate = this.onLocationUpdate.bind(this)

  }
  
  handleSceneChange (scene) {
    this.setState({ scene, locations: app.local.world.locations.Search(this.state.search, scene, this.state.page) })
  }

  handleLocationClick () {
    this.setState({ accessible: app.local.world.locations.Accessible(false, false, -1).length, completed: app.local.world.locations.Get(true).length })
  }

  handleSearch (term) {
    this.setState({ search: term.search, locations: app.local.world.locations.Search(term.search, this.state.scene, this.state.page)})
  }

  shouldComponentUpdate (_, nextState) {
    return (this.state != nextState || this.state.scene != nextState.scene);
  }

  onLocationUpdate() {
    this.setState({ locations: app.local.world.locations.Search(this.state.search, this.state.scene, this.state.page) })
  }

  componentDidMount () {
    app.subscribeToWorldUpdate(this.onLocationUpdate)
    app.saveLoad.subscribe('load', () => { app.local.world.subscribeChangeScene(this.handleSceneChange); this.setState({ scene: String(app.local.world.scene), locations: app.local.world.locations.Search(this.state.search, String(app.local.world.scene), 0) }) })
    app.subscribe('view', (world) => { this.setState({ world: app.worlds.indexOf(world), locations: app.local.world.locations.Accessible(this.state.search, this.state.scene, this.state.page)  }) })
    app.subscribe('locations update', this.onLocationUpdate)
  }

  handleContextMenu (e, id) {
    this.setState({ dropdown: { left: e.pageX - 240, top: e.pageY - 22 } })
    this.props.onContextMenu(e, id)
  }

  displaySection (page) {
    this.setState({ page, locations: app.local.world.locations.Search(this.state.search, this.state.scene, page)})
  }

  render () {
    return (
      <div className='pane'>
        <ErrorBoundary fallback={<p>Locations Failed to Load</p>}>
        <MainHeader locations={this.state.locations.length} world={this.state.world} onSearch={this.handleSearch} onSceneChange={this.handleSceneChange} onPageClick={this.displaySection} scene={this.state.scene} page={this.state.page} />
        <LocationDropdown onDropdownClick={this.handleDropdownClick} display={this.props.dropDownOpen} position={{ left: this.state.dropdown.left, top: this.state.dropdown.top }} />
        <div style={{ overflowY: 'auto', height: '90%' }}>
          <List>
            {this.state.locations.map((location, index) => (
                <Location onContextMenu={this.handleContextMenu} useless={location.useless} important={location.important} key={index} id={location.id} item={location.display ? location.display.name : 'None'} name={location.name} />))}
            </List>
        </div>
        </ErrorBoundary>
      </div>
    )
  }
}

export class Location extends React.PureComponent {
  hasRareItem () {
    return Object.values(app.local.world.items).some((item) => (item.name === app.local.world.locations.Array()[this.props.id].item) || (item.name === app.local.world.locations.Array()[this.props.id].item.item))
  }

  render () {
    return (
      <ErrorBoundary fallback={<p>Location Failed to Load</p>}>
        <ListItem style={{ backgroundColor: ((app.global.settings.itemHints.Index() === 1 && this.hasRareItem()) || this.props.important) ? '#cbef28' : '' }} onClick={() => { app.local.world.locations.Array()[this.props.id].Mark(); }} onContextMenu={(e) => { e.preventDefault(); this.props.onContextMenu(e, this.props.id) }}>
          <div className='location-name' style={{ color: this.props.useless ? '#666' : null }}>{this.props.name} {app.global.settings.playerHints.value == true ? <span className='badge'>{app.local.world.locations.Array()[this.props.id].item.player}</span> : null}</div>
          <div className='location-items'>{app.global.settings.itemHints.value === 'show items' ? app.local.world.locations.Array()[this.props.id].item.item : this.props.item}</div>
        </ListItem>
      </ErrorBoundary>
    )
  }
}
