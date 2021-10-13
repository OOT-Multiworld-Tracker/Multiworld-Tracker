import { SettingsManager, ItemManager, TrackerSettings } from './AppManagers'
import { GameWorld } from './GameWorld'

const { EventEmitter } = require('events')

export class App extends EventEmitter {
  constructor () {
    super()
    this.local = {
      world: null,
      scene: -1
    }

    this.global = {
      settings: new SettingsManager(),
      tracker: new TrackerSettings(),
      connected: false
    }

    this.worlds = [new GameWorld(this)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]
  }
}

const app = new App()

setTimeout(() => {
  if (localStorage.getItem('save-autosave') != null) {
    SaveUtils.Load('save-autosave')
  }
}, 1000)

function Autosave () {
  SaveUtils.Save('autosave')
}

setInterval(Autosave, 10000)

export class SaveUtils {
  static GetFiles () {
    return Object.keys(localStorage)
  }

  static async Reset () {
    app.worlds = [new GameWorld(this)]
    app.local.world = app.worlds[0]
  }

  static async Save (name) {
    return new Promise((resolve, reject) => {
      const saveFile = {}
      Object.assign(saveFile, { dungeons: app.local.world.dungeons })
      Object.assign(saveFile, { settings: app.global.settings.Serialize() })
      Object.assign(saveFile, { save: app.local.world.save })
      Object.assign(saveFile, { locations: app.local.world.locations.Array() })

      localStorage.setItem(`save-${name}`, JSON.stringify(saveFile))

      app.emit('saved', saveFile)
      return resolve(saveFile)
    })
  }

  static async Load (name) {
    return new Promise((resolve, reject) => {
      const file = JSON.parse(localStorage.getItem(name))
      app.global.settings = new SettingsManager(file.settings)
      app.local.world.save = file.save
      app.local.world.items = new ItemManager(app.local.world)
      app.local.world.dungeons = file.dungeons

      Object.keys(app.local.world.save.inventory).forEach((key) => {
        if (app.local.world.items[key] !== undefined) {
          if (app.local.world.save.inventory[key] === true) {
            app.local.world.save.inventory[key] = 1
          } else if (app.local.world.save.inventory[key] === false) {
            app.local.world.save.inventory[key] = 0
          }

          app.local.world.items[key].Set(app.local.world.save.inventory[key])
        }
      })

      file.locations.forEach((location, index) => {
        if (location.completed) app.worlds[0].locations.locations.get(String(index)).completed = location.completed
        if (location.item) app.worlds[0].locations.locations.get(String(index)).item = location.item
        if (location.display) app.worlds[0].locations.locations.get(String(index)).display = location.display
      })

      app.emit('loaded', file)
      return resolve(file)
    })
  }
}

export default app
