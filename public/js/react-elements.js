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
          {app.worlds.map((world, index) => { return (<World name={'World ' + index} id={index} items={world.locations.Accessible(false, false).length}/>) })}
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
              if (app.worlds.length === 1 || location.player === myWorld) {
                return location
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
          {app.local.world.locations.Accessible(this.filter, false)}
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

class Location extends React.Component {
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
    }
  }
}