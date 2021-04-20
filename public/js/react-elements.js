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

function SaveList () {
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

function WorldList () {
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

function WorldItemList (props) {
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
          {RenderWorldItems(props.id)}
        </tbody>
      </table>
    </div>
  )
}

function LocationList () {
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

function CompletedLocationList () {
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

function Dungeon (props) {
  return (
    <tr onClick={() => ChangeStatus(props)}>
      <td>{props.name}</td>
      <td>{props.status}</td>
    </tr>
  )
}

function World (props) {
  return (
    <tr onClick={() => ReactDOM.render(<WorldItemList id={props.id} />, document.getElementById('avaliable-root'))}>
      <td>{props.name}</td>
      <td>{props.items}</td>
    </tr>
  )
}

function Item (props) {
  return (
    <tr>
      <td>{props.location}</td>
      <td>{props.name}</td>
    </tr>
  )
}

function Save (props) {
  return (
    <tr onClick={() => LoadState(props.name)}>
      <td>{props.name}</td>
      <td />
    </tr>
  )
}

function Location (props) {
  return (
    <tr onClick={() => MarkComplete(props)}>
      <td>{props.name}</td>
    </tr>
  )
}

function CompleteLocation (props) {
  return (
    <tr onClick={() => UnMark(props)}>
      <td>{props.name}</td>
    </tr>
  )
}
