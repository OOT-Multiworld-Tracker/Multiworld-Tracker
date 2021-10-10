let locationList
let sidebarButtons
let appheader

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
      files.push(<Save name={localStorage.key(i)} />)
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
  constructor () {
    super()
    this.state = { open: false, id: 0, left: 0, top: 0 }
    locationDropdown = this
  }

  render () {
    return (
      this.state.open
        ? (
          <div className='dropdown' style={{ left: this.state.left, top: this.state.top }}>
            <ul>
              <li onClick={() => ToggleCompleted(this.state)}>Toggle Completed</li>
              <li>Set Item</li>
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
    this.state = { search: '', page: 0, scene: -1, accessible: [] }
  }

  displaySection (page) {
    this.setState({ page, accessible: (!this.state.search ? app.local.world.locations.Accessible(this.state.page === 1) : app.local.world.locations.Search(this.state.search)) })
  }

  checkLocation (scene) {
    return this.state.accessible.some(location => location.scene === scene)
  }

  render () {
    return (
      <div>
        <LocationDropdown />
        <div class='btn-group' style={{width: '100%', marginBottom: '4px'}}>
          <select class='btn btn-bottom btn-default' style={{width: '33.34%', marginRight: '1px'}} value={this.state.scene} onChange={(e) => this.setState({ scene: e.target.value })}><option value='-1'>None</option>{scenes.map((scene) => { if (this.checkLocation(String(scene.id))) return (<option key={scene.id} value={scene.id}>{scene.name}</option>); else { if (this.state.scene == scene.id) { this.setState({ scene: -1 }); return null; } } })}</select>
          <button class='btn btn-bottom btn-default' style={{width: '33.34%'}} onClick={() => this.displaySection(0)}>Accessible</button>
          <button class='btn btn-bottom btn-default' style={{width: '33.34%'}} onClick={() => this.displaySection(1)}>Completed</button>
        </div>
        <div className='location-list'>
          {(!this.state.search
            ? app.local.world.locations.Accessible(this.state.page === 1, false, this.state.scene)
            : app.local.world.locations.Search(this.state.search, this.state.scene, this.state.page)).map(location => (
              <Location key={location.id} id={location.id} item={this.showItems ? location.item || 'Unknown' : null} name={location.name} />))}
        </div>
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

  generateItemList () {
    const elements = []

    Object.values(app.worlds[0].items).forEach(item => {
      if (item.Icon !== undefined && elements.length < 30) elements.push(<span key={item} className={item.Index() > 0 ? 'item active' : 'item'}><img src={item.Icon()} width='24' /></span>)
      if ((elements.length != 1 && elements.length % 10 === 1) || elements.length == 10) elements.push(<br />)
    })

    return elements
  }

  openStats () {

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
      <div className='location' onClick={() => LoadState(this.props.name)}>
        <div className='location-name'>{this.props.name}</div>
      </div>
    )
  }
}

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = { connected: false }
    appheader = this
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

class Location extends React.Component {
  contextMenu (id, e) {
    console.log(e)
    locationDropdown.setState({ open: true, id, left: e.pageX - 240, top: e.pageY - 22 })
  }

  render () {
    return (
      <div className='location' onClick={() => ToggleCompleted(this.props)} onContextMenu={(e) => { e.preventDefault(); this.contextMenu(this.props.id, e) }}>
        <div className='location-name'>{this.props.name}</div>
        <div className='location-items'>{this.props.items}</div>
      </div>
    )
    // return (
    //   <tr onClick={() => ToggleCompleted(this.props)}>
    //     <td>{this.props.name}</td>
    //     {this.props.item ? <td>{this.props.item}</td> : null}
    //   </tr>
    // )
  }
}

class SidebarButtons extends React.Component {
  constructor () {
    super()
    this.state = { uploaded: false }
    sidebarButtons = this
  }

  render () {
  return (
    <select className='form-control' onChange={(e) => { eSidebar.setState({ page: parseInt(e.target.value) }) }}>
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
  constructor () {
    super()
    this.state = { page: 0, accessible: 0, completed: 0 }
    eSidebar = this
  }

  render () {
    switch (this.state.page) {
      case 0:
        ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))
        return (
          <div>
            <span>Locations</span>
            <table class='table table-striped table-hover'>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Avaliable</td>
                  <td>{this.state.accessible}</td>
                </tr>
                <tr>
                  <td>Completed</td>
                  <td>{this.state.completed}</td>
                </tr>
              </tbody>
            </table>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style={{width: (this.state.completed / app.local.world.locations.All().size)*100 + "%"}}></div>
            </div>
            <br/>
            {
              app.worlds.map((world) => { return <Player save={world.save} /> })
            }
            <br/>
          </div>
        )
      case 1:
        return (
          <div>
            <button className='btn btn-dark' style={{ marginBottom: '4px', width: '100%', backgroundColor: 'rgb(113 47 47)' }} onClick={() => StartOver()}>Start Over</button>
            <br/>
            <div style={{display: "inline", fontWeight: 'bolder'}}>
              Files
              <span style={{float: "right", fontWeight: 'bolder' }} onClick={() => SaveAlert()} className = 'btn btn-default icon icon-plus' />
            </div>
            <Saves />
          </div>
        )
      case 2:
        return (
          <div>
            <p>My World ID</p>
            <input type='number' onInput={(elem) => { myWorld = elem.target.value; eSidebar.render(); app.local.world = app.worlds[myWorld - 1] }} />
            <p>Worlds</p>
            <Worlds />
          </div>
        )
      case 3:
        return (
          <div>
            <p>Items</p>
            <Items />
          </div>
        )
      case 4:
        return (
          <div>
            <input type='file' onInput={(elem) => { SpoilerUploaded(elem.target) }} title='Upload Spoiler' />
            <p>Tracker Settings</p>
            
            <p>Settings</p>
            <Settings />
            <p>Dungeons</p>
            <Dungeons />
          </div>
        )
    }
  }
}

if (window.isElectron) { ReactDOM.render(<Header />, document.getElementById('header-root')) }
ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))