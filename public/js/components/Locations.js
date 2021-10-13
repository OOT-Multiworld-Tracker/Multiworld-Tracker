import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'
import Parser from '../Parser'

export class LocationDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, id: 0, left: this.props.position.left, top: this.props.position.top }
    this.onDropdownClick = this.props.onDropdownClick.bind(this)
  }

  render () {
    console.log(this.props)
    return (
      this.props.display
        ? (
          <div className='dropdown' style={{ left: this.props.position.left, top: this.props.position.top }}>
            <ul>
              <li onClick={() => app.local.world.locations.ToggleCompleted(this.state)}>Toggle Completed</li>
              <li onClick={(e) => this.onDropdownClick(e, this.state.id)}>Set Item</li>
              <li className='dropdown-button'>Set Tag &gt;
                <div className='dropdown side' style={{ left: '180px', bottom: '0px' }}>
                  <ul>
                    <li>Set Useless</li>
                    <li>Set Reminder</li>
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

    this.state = { search: '', page: 0, scene: -1, dropdown: { } }

    this.handleDropdownClick = this.props.onDropdownClick
    this.handleContextMenu = this.handleContextMenu.bind(this)
  }

  handleContextMenu (e, id) {
    console.log(id)
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
          this.setState({ scene: -1 })
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
      <>
        <LocationDropdown onDropdownClick={this.handleDropdownClick} display={this.props.dropDownOpen} position={{ left: this.state.dropdown.left, top: this.state.dropdown.top }} />
        <div class='btn-group' style={{ width: '100%', marginBottom: '4px' }}>
          <select class='btn btn-bottom btn-default' style={{ width: '33.34%', marginRight: '1px' }} value={this.state.scene} onChange={(e) => this.setState({ scene: e.target.value })}><option value='-1'>None</option>{this.getScenes()}</select>
          <button class='btn btn-bottom btn-default' style={{ width: '33.34%', backgroundColor: this.state.page === 0 ? '#444' : null }} onClick={() => this.displaySection(0)}>Accessible <span class='badge'>{app.local.world.locations.Accessible(false, false, -1).length}</span></button>
          <button class='btn btn-bottom btn-default' style={{ width: '33.34%', backgroundColor: this.state.page === 1 ? '#444' : null }} onClick={() => this.displaySection(1)}>Completed <span class='badge'>{app.local.world.locations.Get(true).length}</span></button>
        </div>
        <List>
          {(!this.props.search
            ? app.local.world.locations.Accessible(this.state.page === 1, false, this.state.scene)
            : app.local.world.locations.Search(this.props.search, this.state.scene, this.state.page)).map((location, index) => (
              <Location onContextMenu={this.handleContextMenu} key={index} id={location.id} item={location.display ? location.display.name : 'None'} name={location.name} />))}
        </List>
      </>
    )
  }
}

export class Location extends React.Component {
  hasRareItem () {
    return Object.values(app.local.world.items).some((item) => (item.name === app.local.world.locations.Array()[this.props.id].item) || (item.name === app.local.world.locations.Array()[this.props.id].item.item))
  }

  render () {
    return (
      <ListItem style={{ backgroundColor: (app.global.tracker.highlightImportantItems.value === true && this.hasRareItem()) ? { backgroundColor: '#cbef28' } : '' }} onClick={() => app.local.world.locations.ToggleCompleted(this.props)} onContextMenu={(e) => { e.preventDefault(); this.props.onContextMenu(e, this.props.id) }}>
        <div className='location-name'>{this.props.name}</div>
        <div className='location-items'>{this.props.item}</div>
      </ListItem>
    )
  }
}
