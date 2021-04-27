RenderAvaliable()
RenderCompleted()

RenderSidebar()

function RenderAvaliable () {
  ReactDOM.render(<LocationList />, document.getElementById('avaliable-root'))
}

function RenderCompleted () {
  ReactDOM.render(<CompletedLocationList />, document.getElementById('completed-root'))
}

function RenderSidebar (page = 0) {
  sidebar = page
  console.log("Rendering sidebar " + sidebar);
  ReactDOM.unmountComponentAtNode(document.getElementsByClassName('sidebar')[0])
  switch (page) {
    case 0:
      ReactDOM.render((<div>
        <input type='file' onInput={(elem) => { SpoilerUploaded(elem.target) }} title='Upload Spoiler' />
        <PlayerInfo name={save.player_name}/>
        <div className='world_id'>{'World ' + myWorld}</div>

        <p>Dungeons</p>
        <div id='dungeon-root' />
                       </div>), document.getElementsByClassName('sidebar')[0])
      RenderAvaliable()
      ReactDOM.render(<DungeonList />, document.getElementById('dungeon-root'))
      break
    case 1:
      ReactDOM.render((<div>
        <button className='btn btn-default' onClick={() => SaveAlert()}>Save</button>
        <p>Files</p>
        <div id='save-root' />
                       </div>), document.getElementsByClassName('sidebar')[0])
      ReactDOM.render(<SaveList />, document.getElementById('save-root'))
      break
    case 2:
      ReactDOM.render((<div>
        <p>My World ID</p>
        <input type='number' onInput={(elem) => { myWorld = elem.target.value; ReactDOM.render(<WorldList />, document.getElementById('world-root')) }} value={myWorld} />
        <p>Worlds</p>
        <div id='world-root' />
                       </div>), document.getElementsByClassName('sidebar')[0])
      ReactDOM.render(<WorldList />, document.getElementById('world-root'))
      break
    case 3:
      ReactDOM.render((<div>
        <p>Items</p>
        <div id='item-root' />
          </div>), document.getElementsByClassName('sidebar')[0])
      ReactDOM.render(<ItemList />, document.getElementById('item-root'))
      break
  }
}

function RenderWorlds () {
  return worlds.map(world => {
    let items = 0

    Object.keys(worlds[worlds.indexOf(world)].locations).map(item => {
      const location = locations.get(Object.keys(worlds[worlds.indexOf(world)].locations).indexOf(item) + 1)
      if (location && (worlds.length == 1 || worlds[worldId].locations[item].player == myWorld) && (!location.logic || location.logic({ save, settings, locations: MapToArray(locations) })) && !worlds[worlds.indexOf(world)].locations[item].completed) { items++ }
    })

    return (<World name={'World' + (worlds.indexOf(world) + 1)} id={worlds.indexOf(world)} items={items} />)
  })
}

function RenderWorldItems (worldId) {
  return Object.keys(worlds[worldId].locations).map(item => {
    const location = locations.get(Object.keys(worlds[worldId].locations).indexOf(item))

    if (location && (worlds.length == 1 || worlds[worldId].locations[item].player == myWorld) && (location.preExit == true || CanExitForest(worlds[worldId])) && (!location.logic || location.logic(worlds[worldId])) && !worlds[worldId].locations[item].completed) { 
      return (<Item location={location.name} name={worlds[worldId].locations[item].item||worlds[worldId].locations[item]} />) 
    }
  })
}

function GetAccessibleLocations () {
  return locationJson.map(location => {
    if ((location.preExit == true || CanExitForest()) && (!location.logic || location.logic({ save, settings, locations: MapToArray(locations) })) && !locations.get(location.id).completed) { return (<Location id={location.id} name={location.name} />) }
  })
}

function GetCompleteLocations () {
  return locationJson.map(location => {
    if (locations.get(location.id).completed) { return (<CompleteLocation id={location.id} name={location.name} />) }
  })
}

function Rerender () {
  RenderAvaliable();
  RenderSidebar();
}

function RenderDungeons () {
  return dungeons.map(dungeon => {
    return (<Dungeon name={dungeon.name} status={dungeon.mq == true ? 'Master' : 'Vanilla'} />)
  })
}

function RenderSaves () {
  const files = []
  for (let i = 0; i < localStorage.length; i++) {
    const file = localStorage.key(i)
    if (!file) { break }
    files.push(file)
  }
  return files.map(file => {
    return (<Save name={file} />)
  })
}

function ChangeStatus (props) {
  dungeons.forEach((dungeon) => {
    if (dungeon.name == props.name) { dungeon.mq = !dungeon.mq }
  })

  ReactDOM.render(<DungeonList />, document.getElementById('dungeon-root'))
  RenderAvaliable()
}
