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

//if (window.isElectron) { ReactDOM.render(<Header />, document.getElementById('header-root')) }
//ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))