let locationList

class Dungeons extends React.Component {
  constructor () {
    super()
    this.state = { dungeons: app.local.world.dungeons }
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Dungeon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {app.local.world.dungeons.map((dungeon) => {
            return (
              <tr onClick={() => { dungeon.mq = !dungeon.mq; this.setState({ dungeons: app.local.world.dungeons }) }}>
                <td>{dungeon.name}</td>
                <td>{dungeon.mq == true ? 'Master' : 'Vanilla'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

class Items extends React.Component {
  constructor () {
    super()
    this.state = { items: app.local.world.save }
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Item</th>
            <th>Have</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(app.local.world.items).map((item) => {
            if (item instanceof KeyManager) {
              return [(
                <tr key={item.name}>
                  <th>{item.name}</th>
                  <th>Have</th>
                </tr>
              ), (
                <tr key={item.smallKeys.name} onClick={() => { item.smallKeys.Toggle(); this.setState({ items: app.local.world.save }); app.RenderLocations() }}>
                  <td>{item.smallKeys.name}</td>
                  <td>{item.smallKeys.value}</td>
                </tr>
              ), (
                <tr key={item.bigKey.name} onClick={() => { item.bigKey.Toggle(); this.setState({ items: app.local.world.save }); app.RenderLocations() }}>
                  <td>{item.bigKey.name}</td>
                  <td>{item.bigKey.value}</td>
                </tr>
              )]
            }

            return (
              <tr key={item.name} onClick={() => { item.Toggle(); this.setState({ items: app.local.world.save }); app.RenderLocations() }}>
                <td>{item.name}</td>
                <td>{item.value === '0' ? 'None' : (item.value === '1' ? 'Have' : item.value)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

class Saves extends React.Component {
  list () {
    const files = []
    for (let i = 0; i < localStorage.length; i++) {
      files.push(<Save onClick={this.props.onSaveClick} name={localStorage.key(i)} />)
    }
    return files
  }

  render () {
    return (
      <div className='location-list'>
        {this.list()}
      </div>
    )
  }
}

class Worlds extends React.Component {
  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>World</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {app.worlds.map((world, index) => { return (<World name={world.save.player_name} id={index} items={world.locations.Accessible(false, false).filter(location => location.item && (app.worlds.length === 1 || location.item.player == myWorld)).length} />) })}
        </tbody>
      </table>
    )
  }
}

class ItemPopulation extends React.Component {
  render () {
    return (
      <div>
        <p>World Items</p>
        <table className='table-striped'>
          <thead>
            <tr>
              <th>Location</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {app.worlds[this.props.id].locations.Accessible(false, true).map(location => {
              if (location.item && (app.worlds.length === 1 || location.item.player == myWorld)) {
                return <Location id={location.id} item={location.item.item || 'Unknown'} name={location.name} />
              } else return null
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

let locationDropdown

class LocationDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, id: 0, left: 0, top: 0 }
    locationDropdown = this
    this.onDropdownClick = this.props.onDropdownClick.bind(this)
  }

  render () {
    return (
      this.state.open
        ? (
          <div className='dropdown' style={{ left: this.state.left, top: this.state.top }}>
            <ul>
              <li onClick={() => ToggleCompleted(this.state)}>Toggle Completed</li>
              <li onClick={(e) => this.onDropdownClick(e, this.state.id)}>Set Item</li>
              <li className='dropdown-button'>Set Tag >
              <div className='dropdown side' style={{ left: '180px', bottom: '0px' }}>
                <ul>
                  <li>Set Useless</li>
                  <li>Set Reminder</li>
                </ul>
              </div></li>
            </ul>
          </div>
          )
        : null
    )
  }
}

class Locations extends React.Component {
  constructor (props) {
    super(props)
    this.filter = props.completed || false
    this.showItems = props.showItems || false

    if (!this.filter) { locationList = this }
    this.state = { search: '', page: 0, scene: -1 }

    this.onDropdownClick = this.props.onDropdownClick
  }

  displaySection (page) {
    this.setState({ page })
  }

  getScenes () {
    const accessible = app.local.world.locations.Accessible(this.state.page == 1, false, -1)
    const sceneList = scenes.map((scene) => { if (this.checkLocation(accessible, String(scene.id))) return (<option key={scene.id} value={scene.id}>{scene.name}</option>); else { if (this.state.scene == scene.id) { this.setState({ scene: -1 }); return null; } } })

    return sceneList
  }

  checkLocation (accessible, scene) {
    return accessible.some(location => location.scene === scene)
  }

  render () {
    return (
      <React.Fragment>
        <LocationDropdown onDropdownClick={this.onDropdownClick}/>
        <div class='btn-group' style={{width: '100%', marginBottom: '4px'}}>
          <select class='btn btn-bottom btn-default' style={{width: '33.34%', marginRight: '1px'}} value={this.state.scene} onChange={(e) => this.setState({ scene: e.target.value })}><option value='-1'>None</option>{this.getScenes()}</select>
          <button class='btn btn-bottom btn-default' style={{width: '33.34%', backgroundColor: this.state.page===0 ? "#444" : null}} onClick={() => this.displaySection(0)}>Accessible <span class='badge'>{app.local.world.locations.Accessible(false, false, -1).length}</span></button>
          <button class='btn btn-bottom btn-default' style={{width: '33.34%', backgroundColor: this.state.page===1 ? "#444" : null }} onClick={() => this.displaySection(1)}>Completed <span class='badge'>{app.local.world.locations.Get(true).length}</span></button>
        </div>
        <div className='location-list'>
          {(!this.props.search
            ? app.local.world.locations.Accessible(this.state.page === 1, false, this.state.scene)
            : app.local.world.locations.Search(this.props.search, this.state.scene, this.state.page)).map(location => (
              <Location key={location.id} id={location.id} item={location.display ? location.display.name : "None"} name={location.name} />))}
        </div>
      </React.Fragment>
    )
  }
}

class Location extends React.Component {
  contextMenu (id, e) {
    console.log(e)
    locationDropdown.setState({ open: true, id, left: e.pageX - 240, top: e.pageY - 22 })
  }

  hasRareItem () {
    return Object.values(app.local.world.items).some((item) => (item.name === app.local.world.locations.Array()[this.props.id].item) || (item.name === app.local.world.locations.Array()[this.props.id].item.item))
  }

  render () {
    return (
      <div className='location' style={{ backgroundColor: (app.global.tracker.highlightImportantItems.value == true && this.hasRareItem()) ? {backgroundColor: "#cbef28"} : ""}} onClick={() => ToggleCompleted(this.props)} onContextMenu={(e) => { e.preventDefault(); this.contextMenu(this.props.id, e) }}>
        <div className='location-name'>{this.props.name}</div>
        <div className='location-items'>{this.props.item}</div>
      </div>
    )
  }
}

class Settings extends React.Component {
  constructor () {
    super()
    this.state = { settings: app.global.settings }
  }

  changeSetting (id) {
    app.global.settings[id].Toggle()
    this.setState({ settings: app.global.settings })
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(app.global.settings).map((setting) => (<tr onClick={() => this.changeSetting(setting)}><td>{app.global.settings[setting].name}</td><td>{(app.global.settings[setting].value == true ? "Yes" : (app.global.settings[setting].value == false ? "No" : app.global.settings[setting].value))}</td></tr>))}
        </tbody>
      </table>
    )
  }
}

class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = { name: this.props.save.player_name }
  }

  componentDidMount () {
    this.timer = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  tick () {
    this.setState({ name: this.props.save.player_name })
  }

  generateContainers () {
    const elements = []
    for (let i = 0; i < this.props.save.heart_containers; i++) {
      elements.push(<span className='heart-container'><img src='/images/container.png' width='16' /></span>)

      if (elements.length === 10) elements.push(<br />)
    }
    return elements
  }

  render () {
    return (
      <div className='player'>
        <div className='character_name' onClick={() => this.openStats()}>{this.props.save.player_name}</div>
        <div className='heart_containers'>{this.generateContainers()}</div>
      </div>
    )
  }
}

class World extends React.Component {
  render () {
    return (
      <tr onClick={() => ReactDOM.render(<ItemPopulation id={this.props.id} />, document.getElementById('avaliable-root'))}>
        <td>{this.props.name}</td>
        <td>{this.props.items}</td>
      </tr>
    )
  }
}

class Save extends React.Component {
  render () {
    return (
      <div className='location' onClick={(e) => { this.props.onClick(e, this.props.name) }}>
        <div className='location-name'>{this.props.name}</div>
      </div>
    )
  }
}

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = { connected: false }
  }

  render () {
    return (
      <header className='toolbar toolbar-header'>
        <div className='toolbar-actions'>
          <span className='title'>Ocarina of Time - Multiworld Autotracker</span>
          <div className='btn-group pull-right'>
            <button className='btn btn-default btn-dark pull-right'>
              <span className={this.state.connected ? 'icon icon-check' : 'icon icon-cancel'} />
            </button>
            <button className='btn btn-default btn-dark pull-right'>
              <span className='icon icon-download' />
            </button>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'minimize')}>
              <span className='icon icon-minus' />
            </button>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'window_size')}>
              <span className='icon icon-doc' />
            </button>
            <button className='btn btn-default btn-dark pull-right' onClick={() => require('electron').ipcRenderer.send('packets', 'close')}>
              <span className='icon icon-cancel' />
            </button>
          </div>
        </div>
      </header>
    )
  }
}

class SidebarButtons extends React.Component {
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
      <hr/>
      {this.state.uploaded ? <option value='2'>Worlds</option> : <option value='2' disabled>Worlds</option>}
    </select>
  )
  }
}

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = { page: 0, accessible: 0, completed: 0 }

    this.handleChange = this.handleChange.bind(this)
    this.pages = [this.homePage(), this.savePage(), this.worldPage(), this.itemPage(), this.settingsPage()];
  }

  renderPage () {
    return this.pages[parseInt(this.state.page)]
  }

  handleChange (e) {
    this.setState({ page: e.target.value })
  }

  homePage () {
    return (
      app.worlds.map((world) => { return <Player save={world.save} /> })
    )
  }

  savePage () {
    return (
      <React.Fragment>
        <button className='btn btn-dark' style={{ marginBottom: '4px', width: '100%', backgroundColor: 'rgb(113 47 47)' }} onClick={() => StartOver()}>Start Over</button>
        <br/>
        <div class='list'>
          <div class='list-header'>Files <span onClick={() => SaveAlert()} className = 'btn btn-default icon icon-plus' /></div>
          <div class='list-content'><Saves onSaveClick={this.props.onModal} /></div>
        </div>
      </React.Fragment>
    )
  }

  itemPage () {
    return (
      <Items />
    )
  }

  settingsPage () {
    return (
      <React.Fragment>
        <Settings />
        <br/>
        <Dungeons />
      </React.Fragment>
    )
  }

  worldPage () {
    return (
      <Worlds />
    )
  }

  render () {
    return (
      <React.Fragment>
        <SidebarButtons onChange={this.handleChange}/>
        {this.renderPage()}
      </React.Fragment>
    )
  }
}

class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onChange(e)
  }

  render() {
    return (
      <input type='text' className='form-control search-bar' onChange={this.handleChange} placeholder='Search...'/>
    )
  }
}

class ModalLayer extends React.Component {
  constructor (props) {
    super(props)
    this.onOutsideClick = this.props.onOutsideClick.bind(this)
  }

  render () {
    return (
      this.props.display == true ?
      <div className='modal-layer' style={{ display: this.props.display }} onClick={this.onOutsideClick}>
        {this.props.children}
      </div>
      : null
    )
  }
}

class ItemModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onItemSet.bind(this);
  }

  render () {
    console.log(this.props)
    return (
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='location' onClick={e => {app.local.world.locations.locations.get(this.props.location).display = {name: "None"}; e.stopPropagation(); this.closeModal(e)}}>
          <div className='location-name'>None</div>
        </div>
        {Object.values(app.local.world.items).map((item) => {
          return (
            <div className='location' onClick={e => {app.local.world.locations.locations.get(this.props.location).display = {name: item.name}; e.stopPropagation(); this.closeModal(e)}}>
              <div className='location-name'>{item.name}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

class SaveModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onSaveLoad.bind(this);
  }

  render () {
    const save = JSON.parse(localStorage.getItem(this.props.save)).save;
    console.log(save)
    return (
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <p>{this.props.save}</p>
        <Player save={save}/>
        <div className='progress'>
          <div className='progress-bar' style={{width: '20%'}}/>
        </div>
        <button className='btn btn-default' style={{width: '50%'}}onClick={() => {this.closeModal(); LoadState(this.props.save)}}>Load</button>
        <button className='btn btn-warning' style={{width: '50%'}} onClick={() => {this.closeModal(); localStorage.removeItem(this.props.save)}}>Delete</button>
      </div>
    )
  }
}

const WorldContext = React.createContext('world');

class Application extends React.Component {
  constructor () {
    super()
    this.state = {world: app.local.world, search: '', sidebar: 0, display: 0}

    this.handleSearch = this.handleSearch.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setItem = this.setItem.bind(this)
    this.handleSidebarModal = this.handleSidebarModal.bind(this)

    this.selectedLocation = 0;
    this.selectedSave = 0;
  }

  handleSearch (e) {
    this.setState({ search: e.target.value })
  }

  handleDropdown (e, id) {
    this.selectedLocation = id
    this.setState({ display: 1 })
  }

  handleSidebarModal (e, name) {
    this.selectedSave = name
    this.setState({ display: 2 })
  }

  closeModal (e) {
    this.setState({ display: 0 })
  }

  getModal () {
    switch (this.state.display) {
      case 1:
        return <ItemModal onItemSet={this.setItem} location={this.selectedLocation}/>
      case 2:
        return <SaveModal onSaveLoad={this.closeModal} save={this.selectedSave} />
    }
  }

  setItem (e) {
    this.closeModal(e)
    this.forceUpdate()
  }

  render () {
    return (
      <div className='window'>
        <Header />
        <WorldContext.Provider value={this.state.world}>
          <div className='window-content'>
            <ModalLayer onOutsideClick={this.closeModal} display={this.state.display > 0}>
              {this.getModal()}
            </ModalLayer>
            <div className='pane-group'>
              <div class="pane-md" style={{width: '240px'}}>
                <Sidebar onModal={this.handleSidebarModal} page={this.state.sidebar} />
              </div>
              <div class="pane">
                <SearchBar onChange={this.handleSearch}/>
                <Locations onDropdownClick={this.handleDropdown} search={this.state.search} />
              </div>
            </div>
          </div>
        </WorldContext.Provider>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById('root'))


//if (window.isElectron) { ReactDOM.render(<Header />, document.getElementById('header-root')) }
//ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))