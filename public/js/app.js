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

  RenderLocations () {
    ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))
    ReactDOM.render(<Locations completed='true' />, document.getElementById('completed-root'))
  }

  SearchLocations (term) {
    locationList.setState({ search: term })
  }
}

/**
 * A player world instance. Controls everything related to worlds.
 */
class GameWorld {
  constructor (save, dungeons, locations) {
    this.save = save
    this.locations = new LocationManager(this, locations)
    this.dungeons = dungeons
  }
}

/**
 * The base manager that controls locations and spoilers.
 */
class LocationManager {
  constructor (world, spoiler) {
    this.world = world
    this.spoiler = spoiler
    this.locations = ParseLocations(new Map(), this.spoiler)
  }

  /**
   * Returns a map of the available items
   * @returns {Map[Location]}
   */
  All () {
    return this.locations
  }

  /**
   * Returns a full array of the location items
   * @returns {Location[]}
   */
  Array () {
    return MapToArray(this.locations)
  }

  /**
  / Lists all accessible locations for the world. Filters by save and accessibility.
  / @returns {Location[]}
  */
  Accessible (complete = false, showItems = false) {
    return this.Array().filter(location => (IsAccessible(location, this.world) && complete === false && !location.completed) || (complete && location.completed === true))
  }

  /**
   * Returns a list of all of the items that contains all of the keywords.
   * @param {String} term A full string containing keywords
   * @returns {Location[]}
   */
  Search (term) {
    const keywords = term.split(' ')
    return this.Accessible().filter((location) => {
      let valid = true
      keywords.forEach(keyword => {
        if (!location.name.toLowerCase().includes(keyword)) {
          valid = false
        }
      })
      return valid
    })
  }

  /**
   * Returns a list of locations based on completion flag.
   * @param {boolean} completed Completion flag
   * @returns {Location[]}
   */
  Get (completed = false) {
    return this.Array().filter(location => IsAccessible(location, this.local.world)).filter(location => location.completed === completed)
  }
}
