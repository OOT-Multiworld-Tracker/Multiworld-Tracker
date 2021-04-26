class DungeonList extends React.Component {
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
          {RenderDungeons()}
        </tbody>
      </table>
    )
  }
}

class SaveList extends React.Component {
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
          {RenderSaves()}
        </tbody>
      </table>
    )
  }
}

class WorldList extends React.Component {
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
          {RenderWorlds()}
        </tbody>
      </table>
    )
  }
}

class WorldItemList extends React.Component {
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
            {RenderWorldItems(this.props.id)}
          </tbody>
        </table>
      </div>
    ) 
  }
}

class LocationList extends React.Component {
  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {GetAccessibleLocations()}
        </tbody>
      </table>
    )
  }
}

class CompletedLocationList extends React.Component {
  render() {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {GetCompleteLocations()}
        </tbody>
      </table>
    )
  }
}
class Dungeon extends React.Component {
  render() {
    return (
      <tr onClick={() => ChangeStatus(this.props)}>
        <td>{this.props.name}</td>
        <td>{this.props.status}</td>
      </tr>
    )
  }
}

class PlayerInfo extends React.Component {
  render() {
  }
}

class World extends React.Component {
  render() {
    return (
      <tr onClick={() => ReactDOM.render(<WorldItemList id={this.props.id} />, document.getElementById('avaliable-root'))}>
        <td>{this.props.name}</td>
        <td>{this.props.items}</td>
      </tr>
    )
  }
}

class Item extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.location}</td>
        <td>{this.props.name}</td>
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
      <tr onClick={() => MarkComplete(this.props)}>
        <td>{this.props.name}</td>
      </tr>
    )
  }
}

class CompleteLocation extends React.Component {
  render() {
    return (
      <tr onClick={() => UnMark(this.props)}>
        <td>{this.props.name}</td>
      </tr>
    )
  }
}
