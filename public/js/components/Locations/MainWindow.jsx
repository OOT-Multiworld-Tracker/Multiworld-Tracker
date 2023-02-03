import React, { Component, Fragment } from 'react'
import app from '../../app'
import { List, ListItem } from '../Lists'
import { ErrorBoundary } from '@sentry/react'

import './MainWindow.css'
import MainHeader from './MainHeader'
import LocationDropdown from './LocationDropdown'
import Locations from './Locations'

export default class MainWindow extends Component {
  constructor(props) {
    super(props)
    this.filter = props.completed || false
    this.showItems = props.showItems || false

    this.state = {
      search: '', page: 0, scene: -1, dropdown: {}, world: 0, type: 0
    }

    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleSceneChange = this.handleSceneChange.bind(this)
    this.displaySection = this.displaySection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.displayType = this.displayType.bind(this)

    this.collapse = {};
  }

  handleSceneChange(scene) {
    this.setState({ scene, locations: app.local.world.locations.Search(this.state.search, scene, this.state.page) })
  }

  handleSearch(term) {
    this.setState({ search: term.search, locations: app.local.world.locations.Search(term.search, this.state.scene, this.state.page) })
  }

  shouldComponentUpdate(_, nextState) {
    return (this.state != nextState || this.state.scene != nextState.scene);
  }

  componentDidMount() {
    app.saveLoad.subscribe('load', () => { app.local.world.subscribeChangeScene(this.handleSceneChange); this.setState({ locations: app.local.world.locations.Search(this.state.search, -1, 0) }) })
    app.subscribe('view', (world) => { this.setState({ world: app.worlds.indexOf(world), locations: app.local.world.locations.Accessible(this.state.search, this.state.scene, this.state.page) }) })
  }

  handleContextMenu(e, id) {
    this.setState({ dropdown: { left: e.pageX - 240, top: e.pageY - 22 } })
    this.props.onContextMenu(e, id)
  }

  displayType(type) {
    this.setState({ type })
  }

  displaySection(page) {
    this.setState({ page, locations: app.local.world.locations.Search(this.state.search, this.state.scene, page) })
  }

  walkthrough() {
    return (
      <List>{Object.values(app.walkthrough).map((step, index) => {
        return (
          <>
            <WalkthroughLocation type="header" name={index == 0 ? "Skips" : `Sphere ${index}`} />
            {Object.entries(step).filter((walk) => !walk[1].completed).map((walk) => (<WalkthroughLocation name={walk[0]} />))}
          </>
        )
      })}</List>)
  }

  locations() {
    return (
      <Locations onContextMenu={this.handleContextMenu} targetedScene={this.state.scene} pageData={{ page: this.state.page, search: this.state.search }} />
    )
  }

  render() {
    return (
      <div className='pane'>
        <ErrorBoundary fallback={<p>Locations Failed to Load</p>}>
          <MainHeader
            onPageUpdate={this.displaySection}
            onSearch={this.handleSearch}
            onSceneUpdate={this.handleSceneChange}
            onTypeUpdate={this.displayType}
            pageData={{ page: this.state.page, scene: this.state.scene }}
            type={this.state.type}
          />

          <LocationDropdown
          onDropdownClick={this.props.onDropdownClick}
          display={this.props.dropDownOpen}
          position={{
            left: this.state.dropdown.left,
            top: this.state.dropdown.top
          }} />

          <div style={{ overflowY: 'auto', height: '85%' }}>
            {this.state.type == 0 ? this.locations() : this.walkthrough()}
          </div>
        </ErrorBoundary>
      </div>
    )
  }
}

export class WalkthroughLocation extends React.PureComponent {
  render() {
    return (
      <ErrorBoundary fallback={<p>Location Failed to Load</p>}>
        <ListItem
          type={this.props.type}>
          <div className='location-name'>
            {this.props.name}
          </div>
        </ListItem>
      </ErrorBoundary>
    )
  }
}
