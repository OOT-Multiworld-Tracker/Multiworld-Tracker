import { SettingsManager } from './AppManagers'
import { GameWorld } from './GameWorld'

const LocationList = require('./locations.json')
const SceneList = require('./scenes.json')

export default class Parser {
  static ParseSpoiler (log) {
    const spoiler = { }

    spoiler.settings = new SettingsManager(log.settings)
    spoiler.log = log
    spoiler.seed = log[':seed']
    spoiler.worlds = []

    if (spoiler.settings.world_count > 1) {
      Object.values(log.locations).forEach((_, index) => {
        spoiler.worlds.push(new GameWorld())
      })

      Object.values(log.dungeons).forEach((world, index) => {
        for (let i = 0; i < Object.keys(world).length; i++) {
          spoiler.worlds[index].dungeons[i].mq = world[Object.keys(world)[i]] === 'mq'
        }
      })
    } else {
      console.log('Loading singleplayer world')
      spoiler.worlds.push(new GameWorld())

      for (let i = 0; i < Object.keys(spoiler.log.dungeons).length; i++) {
        spoiler.worlds[0].dungeons[i].mq = log.dungeons[Object.keys(log.dungeons)[i]] === 'mq'
      }
    }

    spoiler.emit('spoiler parsed', log)

    return spoiler
  }

  static ParseLocations (worlds, spoiler = null) {
    const locations = new Map()
    console.log(LocationList)

    LocationList.forEach((location, index) => {
      location.id = index

      if (location.logic) { location.logic = eval(location.logic) }

      if (spoiler) {
        spoiler.settings.disabled_locations.forEach((locale) => {
          if (locale === location.name) location.completed = true
        })

        location.item = spoiler.locations[worlds.length > 1 ? location.id : location.name]
      }

      locations.set(String(index), location)
    })

    return locations
  }

  static ParseScenes () {
    return SceneList
  }
}
