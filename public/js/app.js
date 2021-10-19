import { ipcRenderer } from 'electron'
import { SettingsManager, ItemManager, TrackerSettings, LocationManager } from './AppManagers'
import { GameWorld } from './classes/GameWorld'
import { NetworkManager } from './classes/NetworkingManager'

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
      connected: false,
      scene: -1
    }

    /**
     * The present electron IPC manager.
     * @type {NetworkManager}
     */
    this.networking = null

    /**
     * The current game world(s).
     * @type {Array[GameWorld]}
     */
    this.worlds = [new GameWorld(this)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]

    this.lastChestID = -1
  }
}

const app = new App()

setTimeout(() => {
  if (localStorage.getItem('autosave') != null) {
    SaveUtils.Load('autosave')
  }
}, 1000)

function Autosave () {
  SaveUtils.Save('autosave')
}

setInterval(Autosave, 10000)

export class SaveUtils {
  /**
   * Returns a key-array of all save files.
   * @returns {String[]}}
   */
  static GetFiles () {
    return Object.keys(localStorage)
  }

  static Delete (name) {
    localStorage.removeItem(name)
  }

  static async Reset () {
    app.global.settings = new SettingsManager()
    app.worlds = [new GameWorld(app)]
    app.local.world = app.worlds[0]
    app.local.world.locations = new LocationManager(app.local.world)
    app.local.world.items = new ItemManager(app.local.world)

    app.emit('loaded', null)
    app.emit('items updated', app.local.world.items)
  }

  /**
   * Save the current game state to localStorage, returns file.
   * @param {*} name
   * @returns {Promise<Object>}
   */
  static async Save (name) {
    return new Promise((resolve, reject) => {
      const saveFile = {}

      Object.assign(saveFile, { // Assign all of the values to the file.
        dungeons: app.local.world.dungeons,
        settings: app.global.settings.Serialize(),
        save: app.local.world.save,
        locations: app.local.world.locations.Array().map((location) => { return { completed: location.completed, item: location.item, display: location.display, name: location.name, preExit: location.preExit, scene: location.scene } })
      })

      console.log(saveFile)

      localStorage.setItem(name, JSON.stringify(saveFile))

      app.emit('saved', saveFile)
      return resolve(saveFile)
    })
  }

  /**
   * Loads the tracker back to a save file's state.
   * @param {*} name
   * @returns {Promise<Object>}
   */
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

app.networking = new NetworkManager(app)

export default app
