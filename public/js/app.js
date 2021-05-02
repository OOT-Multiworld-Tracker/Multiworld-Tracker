class App {
  constructor () {
    this.local = {
      world: null,
      scene: -1
    }

    this.global = {
      settings
    }

    this.worlds = [new GameWorld(save, dungeons)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]
  }

  RenderLocations() {
    ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))
    ReactDOM.render(<Locations completed="true"/>, document.getElementById('completed-root'))
  }

  SearchLocations(term) {
    locationList.setState({search: term})
  }
}

class GameWorld {
  constructor (save, dungeons) {
    this.save = save
    this.locations = new LocationManager(this)
    this.dungeons = dungeons
  }
}

class LocationManager {
  constructor (world) {
    this.world = world
    this.locations = ParseLocations(new Map())
  }

  All () {
    return this.locations
  }

  Array () {
    return MapToArray(this.locations)
  }

  Accessible (complete=false, showItems=false) {
    return this.Array().filter(location => (IsAccessible(location, this.world) && complete == false && !location.completed) || complete && location.completed == true)
  }

  Search (term) {
    const keywords = term.split(' ')
    return this.Accessible().filter((location) => {
      let valid = true
      keywords.forEach(keyword => {
        if (!location.name.includes(keyword)) {
          valid = false
        }
      })
      return valid
    })
  }

  Get (completed = false) {
    return this.Array().filter(location => IsAccessible(location, this.local.world)).filter(location => location.completed === completed)
  }
}