window.isElectron = typeof require !== 'undefined'

if (window.isElectron) {
  require('electron').ipcRenderer.on('packet', (event, data) => {
    const parsed = JSON.parse(data)
    console.log(parsed)

    switch (parsed.payload) {
      case 0:
        Object.keys(parsed.data.save.inventory).forEach((key) => {
          if (app.local.world.items[key] !== undefined) {
            if (parsed.data.save.inventory[key] === true) {
              parsed.data.save.inventory[key] = 1
            } else if (parsed.data.save.inventory[key] === false) {
              parsed.data.save.inventory[key] = 0
            }

            app.local.world.items[key].Set(parsed.data.save.inventory[key])
          }
        })

        app.worlds[myWorld - 1].items = app.local.world.items
        app.RenderLocations()
        break
      case 1:
        // Scene payload
        break
      case 3:
        console.log('Received other map tracker')
        if (app.worlds[parsed.data.world] == app.local.world) // Prevent lost progress through mistakes or attempted trolls.
        { return }

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
  if (!world) { return app.worlds.push(new GameWorld(data.save, dungeons)) }

  Object.keys(data.save.inventory).forEach((key) => {
    if (world.items[key] !== undefined) {
      if (data.save.inventory[key] === true) {
        data.save.inventory[key] = 1
      } else if (data.save.inventory[key] === false) {
        data.save.inventory[key] = 0
      }

      world.items[key].Set(data.save.inventory[key])
    }
  })

  world.locations.Array().forEach((location, index) => { location.completed = data.locations[index] })
}
