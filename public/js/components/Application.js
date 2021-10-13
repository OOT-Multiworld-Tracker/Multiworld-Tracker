import AppContext from './AppContext'
import React from 'react'
import app from '../app'
import Header from './Header'
import ModalLayer from './ModalLayer'
import SaveModal from './Modals/SaveModal'
import CreateSaveModal from './Modals/CreateSaveModal'
import ItemModal from './Modals/ItemModal'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import Locations from './Locations'
import { ErrorBoundary } from '@sentry/react'

export default class Application extends React.Component {
  constructor () {
    super()
    console.log(app)
    this.state = { world: app.local.world, search: '', dropdown: false, sidebar: 0, display: 0, saves: [], locations: app.local.world.locations }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleModal = this.handleModal.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleSetItem = this.handleSetItem.bind(this)
    this.handleSidebarModal = this.handleSidebarModal.bind(this)
    this.handleCreateSave = this.handleCreateSave.bind(this)
    this.handleSaveCreated = this.handleSaveCreated.bind(this)
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleWindowClick = this.handleWindowClick.bind(this)

    this.selectedLocation = 0
    this.selectedSave = 0

    app.on('loaded', (save) => {
      this.setState({ locations: app.local.world.locations })
    })
  }

  handleSearch (e) {
    this.setState({ locations: app.local.world.locations, search: e.target.value })
  }

  handleModal (e) {
    this.setState({ display: 0 })
  }

  handleDropdown (e, id) {
    this.setState({ display: 1 })
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

  getModal () {
    switch (this.state.display) {
      case 1:
        return <ItemModal onItemSet={this.handleSetItem} location={this.selectedLocation} />
      case 2:
        return <SaveModal onSaveLoad={this.handleModal} save={this.selectedSave} />
      case 3:
        return <CreateSaveModal onSave={this.handleSaveCreated} />
    }
  }

  handleSetItem (e) {
    this.handleModal(e)
  }

  render () {
    return (
      <div className='window' onClick={this.handleWindowClick}>
        <Header />
        <div className='window-content'>
          <ModalLayer onOutsideClick={this.handleModal} display={this.state.display > 0}>
            {this.getModal()}
          </ModalLayer>
          <div className='pane-group'>
            <div class='pane-md' style={{ width: '240px' }}>
              <ErrorBoundary fallback={<p>Sidebar failed to load</p>}>
                <Sidebar onSave={this.handleCreateSave} onModal={this.handleSidebarModal} saves={this.state.saves} page={this.state.sidebar} />
              </ErrorBoundary>
            </div>
            <div class='pane'>
              <SearchBar onChange={this.handleSearch} />
              <ErrorBoundary fallback={<p>Locations Failed to Load</p>}>
                <Locations dropDownOpen={this.state.dropdown} onContextMenu={this.handleContextMenu} onDropdownClick={this.handleDropdown} locations={this.state.locations} search={this.state.search} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Application.contextType = AppContext
