import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'
import Parser from '../classes/Parser'
import { ErrorBoundary } from '@sentry/react'

export class LocationDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, id: 0, left: this.props.position.left, top: this.props.position.top }
    this.onDropdownClick = this.props.onDropdownClick.bind(this)
  }

  render () {
    return (
      this.props.display
        ? (
          <div className='dropdown' style={{ left: this.props.position.left, top: this.props.position.top }}>
            <ul>
              <li onClick={() => app.local.world.locations.Array()[this.state.id].Mark()}>Toggle Completed</li>
              <li onClick={(e) => this.onDropdownClick(0)}>Set Item</li>
              <li className='dropdown-button'>Set Tag &gt;
                <div className='dropdown side' style={{ left: '180px', bottom: '0px' }}>
                  <ul>
                    <li onClick={(e) => this.onDropdownClick(1)}>Set Useless</li>
                    <li onClick={(e) => this.onDropdownClick(2)}>Set Reminder</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          )
        : null
    )
  }
}

export default class Locations extends React.Component {
  constructor (props) {
    super(props)
    this.filter = props.completed || false
    this.showItems = props.showItems || false

    this.state = { search: '', page: 0, scene: -1, dropdown: { }, locations: app.local.world.locations.Accessible(false, false, -1) }

    this.handleDropdownClick = this.props.onDropdownClick
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleSceneChange = this.handleSceneChange.bind(this)
  }

  handleSceneChange () {
    app.local.world.scene = scene
    this.setState({ scene: Parser.ParseScenes().filter(sceneOb => this.checkLocation(app.local.world.locations.Accessible(), scene) && sceneOb.id == scene).length > 0 ? scene : -1 })
  }

  componentDidMount () {
    app.local.world.subscribeChangeScene(this.handleSceneChange)
    app.local.world.subscribeUpdate(() => this.setState({ locations: app.local.world.locations.Accessible(false, false, -1) }))
    app.saveLoad.subscribe('load', (() => this.setState({ locations: app.local.world.locations.Accessible(false, false, -1) })))
  }

  handleContextMenu (e, id) {
    this.setState({ dropdown: { left: e.pageX - 240, top: e.pageY - 22 } })
    this.props.onContextMenu(e, id)
  }

  displaySection (page) {
    this.setState({ page })
  }

  getScenes () {
    const accessible = app.local.world.locations.Accessible(this.state.page === 1, false, -1)

    const sceneList = Parser.ParseScenes().map((scene) => {
      if (this.checkLocation(accessible, String(scene.id))) {
        return (<option key={scene.id} value={scene.id}>{scene.name}</option>)
      } else {
        if (this.state.scene === scene.id) {
          this.setState({ scene: '-1' })
          return null
        }

        return null
      }
    })

    return sceneList
  }

  checkLocation (accessible, scene) {
    return accessible.some(location => location.scene === scene)
  }

  render () {
    return (
      <div className='pane'>
        <ErrorBoundary fallback={<p>Locations Failed to Load</p>}>
          <ErrorBoundary fallback={<p>Search failed to load</p>}>
            <input type='text' className='form-control search-bar' onChange={(e) => this.setState({ search: e.target.value })} placeholder='Search...' />
          </ErrorBoundary>
          <LocationDropdown onDropdownClick={this.handleDropdownClick} display={this.props.dropDownOpen} position={{ left: this.state.dropdown.left, top: this.state.dropdown.top }} />
          <div className='btn-group' style={{ width: '100%', marginBottom: '4px' }}>
            <select className='btn btn-bottom btn-default' style={{ width: '33.34%', marginRight: '1px' }} value={this.state.scene} onChange={(e) => this.setState({ scene: e.target.value })}><option value='-1'>None</option>{this.getScenes()}</select>
            <button className='btn btn-bottom btn-default' style={{ width: '33.34%', backgroundColor: this.state.page === 0 ? '#444' : null }} onClick={() => this.displaySection(0)}>Accessible <span className='badge'>{app.local.world.locations.Accessible(false, false, -1).length}</span></button>
            <button className='btn btn-bottom btn-default' style={{ width: '33.34%', backgroundColor: this.state.page === 1 ? '#444' : null }} onClick={() => this.displaySection(1)}>Completed <span className='badge'>{app.local.world.locations.Get(true).length}</span></button>
          </div>
        <div style={{ overflowY: 'auto', height: '90%' }}>
          <List>
            {(!this.state.search
              ? app.local.world.locations.Accessible(this.state.page === 1, false, this.state.scene)
              : app.local.world.locations.Search(this.state.search, this.state.scene, this.state.page)).map((location, index) => (
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
        <ListItem style={{ backgroundColor: ((app.global.settings.itemHints.Index() === 1 && this.hasRareItem()) || this.props.important) ? '#cbef28' : '' }} onClick={() => app.local.world.locations.ToggleCompleted(this.props.id)} onContextMenu={(e) => { e.preventDefault(); this.props.onContextMenu(e, this.props.id) }}>
          <div className='location-name' style={{ color: this.props.useless ? '#666' : null }}>{this.props.name} {app.global.settings.playerHints.value == true ? <span className='badge'>{app.local.world.locations.Array()[this.props.id].item.player}</span> : null}</div>
          <div className='location-items'>{app.global.settings.itemHints.value === 'show items' ? app.local.world.locations.Array()[this.props.id].item.item : this.props.item}</div>
        </ListItem>
      </ErrorBoundary>
    )
  }
}
