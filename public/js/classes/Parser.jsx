import { SettingsManager, Location } from '../AppManagers'
import GameManager from './GameManager'
import { GameWorld } from './GameWorld'

export default class Parser {
  static ParseSpoiler (log, app) {
    const spoiler = { }

    spoiler.settings = new SettingsManager(log.settings)
    spoiler.log = log

    // Holds the data for the walkthrough to be parsed.
    app.walkthrough = log[':playthrough']

    spoiler.seed = log[':seed']
    spoiler.worlds = []

    if (!log.locations) return spoiler

    // multi world.
    if (spoiler.log.settings.world_count > 1) {
      spoiler.worlds = []

      // Push each of the worlds into the list.
      for (let i = 0; i < spoiler.log.settings.world_count; i++) spoiler.worlds.push(new GameWorld(app))

      Object.keys(log.locations).forEach((world, windex) => {
        Object.values(log.locations[world]).forEach((locale, index) => {
          if (!spoiler.worlds[windex].locations.Array()[index]) return
          spoiler.worlds[windex].locations.Array()[index].item = locale
        })
      })

      Object.values(log.dungeons).forEach((world, index) => {
        for (let i = 0; i < Object.keys(world).length; i++) {
          spoiler.worlds[index].dungeons[i].mq = world[Object.keys(world)[i]] === 'mq'
        }
      })
    } else { // single-world
      spoiler.worlds = app.worlds

      for (let i = 0; i < Object.keys(spoiler.log.dungeons).length; i++) {
        spoiler.worlds[0].dungeons[i].mq = log.dungeons[Object.keys(log.dungeons)[i]] === 'mq'
      }

      Object.values(log.locations).forEach((locale, index) => {
        if (!spoiler.worlds[0].locations.Array()[index]) return
        spoiler.worlds[0].locations.Array()[index].item = locale
      })
    }

    return spoiler
  }

  /**
   * Parse the locations.json into a usable map.
   * @param {LocationManager} manager
   * @returns {Map<Location>}
   */
  static ParseLocations (manager) {
    const locations = new Map()

    GameManager.GetSelectedGame().locations.forEach((locale, index) => {
      const location = Object.assign({}, locale)
      location.id = index

      locations.set(String(index), new Location(manager, location))
    })

    return locations
  }

  static ParseScenes () {
    return GameManager.GetSelectedGame().scenes
  }
}
