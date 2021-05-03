var locationList;

class Dungeons extends React.Component {
  constructor () {
    super()
    this.state = { dungeons }
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
          {dungeons.map((dungeon) => {return (
              <tr onClick={() => { dungeon.mq = !dungeon.mq; this.setState({dungeons}) }}>
                <td>{dungeon.name}</td>
                <td>{dungeon.mq == true ? 'Master' : 'Vanilla'}</td>
              </tr>
            )})}
        </tbody>
      </table>
    )
  }
}

class Items extends React.Component {
  constructor () {
    super ()
    this.state = { items: save.inventory }
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
          {Object.keys(this.state.items).map((item) => (
          <tr>
            <td>{item}</td>
            <td>{this.state.items[item] ? 1 : 0}</td>
          </tr>))}
        </tbody>
      </table>
    )
  }
}

class Saves extends React.Component {
  list () {
    const files = []; 
    for (let i = 0; i < localStorage.length; i++) { 
      files.push(<Save name={localStorage.key(i)} />)
    }
    return files;
  }
  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>File</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.list()}
        </tbody>
      </table>
    )
  }
}

class Worlds extends React.Component {
  constructor () {
    super ()
  }

  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>World</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {app.worlds.map((world, index) => { return (<World name={'World ' + index} id={index} items={world.locations.Accessible(false, false).filter(location => location.item && location.item.player == myWorld).length}/>) })}
        </tbody>
      </table>
    )
  }
}


class ItemPopulation extends React.Component {
  constructor (props) {
    super (props)
  }

  render() {
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
                return <Location id={location.id} item={location.item.item || "Unknown"} name={location.name} />
              }
            })}
          </tbody>
        </table>
      </div>
    ) 
  }
}

class Locations extends React.Component {
  constructor (props) {
    super (props)
    this.filter = props.completed || false
    this.showItems = props.showItems || false

    if (!locationList)
     locationList = this
    this.state = {search: ""}
  }

  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {!this.state.search ? app.local.world.locations.Accessible(this.filter, false).map(location => (
      <Location id={location.id} item={this.showItems ? location.item || "Unknown" : null} name={location.name} />)) : 
      
        app.local.world.locations.Search(this.state.search).map(location => (
        <Location id={location.id} item={this.showItems ? location.item || "Unknown" : null} name={location.name} />))}
        </tbody>
      </table>
    )
  }
}

class Settings extends React.Component {
  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(app.global.settings).map((setting) => (<tr><td>{setting}</td><td>{app.global.settings[setting]}</td></tr>))}
        </tbody>
      </table>
    )
  }
}

class Player extends React.Component {
  constructor () {
    super()
    this.state = { name: save.player_name };
  }

  componentDidMount () {
    this.timer = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  tick () {
    this.setState({ name: save.player_name });
  }

  render () {
    return app.worlds.length == 1 ? (
      <div className='character_name'>{this.state.name}</div>
    ) : (<div>World {this.state.name}</div>)
  }
}


class World extends React.Component {
  render() {
    return (
      <tr onClick={() => ReactDOM.render(<ItemPopulation id={this.props.id} />, document.getElementById('avaliable-root'))}>
        <td>{this.props.name}</td>
        <td>{this.props.items}</td>
      </tr>
    )
  }
}

class Save extends React.Component {
  render() {
    return (
      <tr onClick={() => LoadState(this.props.name)}>
        <td>{this.props.name}</td>
        <td />
      </tr>
    )
  }
}

class Header extends React.Component {
  render() {
    return (
      <header className="toolbar toolbar-header">
        {window.isElectron ? <h1 class="title">Ocarina of Time - Multiworld Autotracker</h1> : null}

        <div class="toolbar-actions">
          <div class="btn-group">
            <button onClick={() => eSidebar.setState({page: 0})} class="btn btn-dark btn-default">
              <span class="icon icon-compass"/>
            </button>
            <button onClick={() => eSidebar.setState({page: 1})} class="btn btn-dark  btn-default">
              <span class="icon icon-download"/>
            </button>
            <button onClick={() => eSidebar.setState({page: 2})} class="btn btn-dark btn-default">
              <span class="icon icon-network"></span>
            </button>
            <button onClick={() => eSidebar.setState({page: 3})} class="btn btn-dark btn-default">
              <span class="icon icon-network"></span>
            </button>
            <button onClick={() => eSidebar.setState({page: 4})} class="btn btn-dark btn-default">
              <span class="icon icon-cog"></span>
            </button>
          </div>

          {window.isElectron ? <div class="btn-group pull-right">
              <button class="btn btn-default btn-dark pull-right">
                  <span class="icon icon-minus"></span>
              </button>
              <button class="btn btn-default btn-dark pull-right">
                  <span class="icon icon-doc"></span>
              </button>
              <button class="btn btn-default btn-dark pull-right">
                  <span class="icon icon-cancel"></span>
              </button>
          </div> : null}
        </div>
      </header>
    )
  }
}

class Location extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props)
  }

  render() {
    return (
      <tr onClick={() => ToggleCompleted(this.props)}>
        <td>{this.props.name}</td>
        {this.props.item ? <td>{this.props.item}</td> : null}
      </tr>
    )
  }
}

class Sidebar extends React.Component {
  constructor () {
    super ()
    this.state = { page: 0 }
    eSidebar = this
  }

  render () {
    switch (this.state.page) {
      case 0:
        return (
          <div>
            <input type='file' onInput={(elem) => { SpoilerUploaded(elem.target) }} title='Upload Spoiler' />
              <Player/>
              <div className='world_id'>{'World ' + myWorld}</div>
              <p>Dungeons</p>
              <Dungeons />
          </div>
        );
      case 1:
        return (
          <div>
            <button className='btn btn-default' onClick={() => SaveAlert()}>Save</button>
            <p>Files</p>
            <Saves/>
          </div>
        );
      case 2:
        return (
          <div>
            <p>My World ID</p>
            <input type='number' onInput={(elem) => { myWorld = elem.target.value; }} />
            <p>Worlds</p>
            <Worlds/>
          </div>
        );
      case 3:
        return (
          <div>
            <p>Items</p>
            <Items/>
          </div>
        );
      case 4:
        return (
          <div>
            <p>Settings</p>
            <Settings/>
          </div>
        )
    }
  }
}

ReactDOM.render(<Header/>, document.getElementById("header-root"))