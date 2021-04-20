if (require) {
  require('electron').ipcRenderer.on('packet', (event, data) => {
    const parsed = JSON.parse(data)

    switch (parsed.payload) {
      case 0:
        save = JSON.parse(data).data.save
        RenderAvaliable()
        break
      case 1:
        // Scene payload
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
  for (let i = 1; i < Object.keys(worlds[world].locations).length; i++) {
    worlds[world].locations[Object.keys(worlds[world].locations)[i]].completed = data[i - 1]
  }
}
