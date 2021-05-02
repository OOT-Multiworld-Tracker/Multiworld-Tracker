window.isElectron = typeof require !== "undefined"

if (require) {
  require('electron').ipcRenderer.on('packet', (event, data) => {
    const parsed = JSON.parse(data)
    console.log(parsed)

    switch (parsed.payload) {
      case 0:
        app.local.world.save = parsed.data.save
        app.RenderLocations()
        break
      case 1:
        // Scene payload
        break
      case 3:
        console.log("Received other map tracker")
        if (app.worlds[parsed.data.world]==app.local.world) // Prevent lost progress through mistakes or attempted trolls.
          return

        NetworkDeserialize(app.worlds[parsed.data.world], parsed.data)
        console.log(parsed.data)
        break
    }
  })
}

function NetworkSerialize (map, data) {
  const array = []
  map.forEach((value) => array.push(value[data] ? 1 : 0))
  return array
}

function NetworkDeserialize (world, data) {
  if (!world)
    return app.worlds.push(new GameWorld(data.save, dungeons))

  world.locations.Array().forEach((location,index) => {location.completed = data.locations[index]})
}
