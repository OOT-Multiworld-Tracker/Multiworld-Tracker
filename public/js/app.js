import { ipcRenderer } from 'electron'
import { SettingsManager, ItemManager, TrackerSettings, LocationManager } from './AppManagers'
import { GameWorld } from './classes/GameWorld'
import Parser from './classes/Parser'
import { ElectronPayloads } from './enum/EnumPayloads'
import { MapToArray } from './Utils'

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
      Object.assign(saveFile, { dungeons: app.local.world.dungeons })
      Object.assign(saveFile, { settings: app.global.settings.Serialize() })
      Object.assign(saveFile, { save: app.local.world.save })
      Object.assign(saveFile, { locations: app.local.world.locations.Array() })

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

export class NetworkManager {
  constructor () {
    require('electron').ipcRenderer.on('packet', (_, data) => {
      const parsed = JSON.parse(data)
      console.log(parsed);

      switch (parsed.payload) {
        case ElectronPayloads.SAVE_UPDATED:
          const items = Object.assign({}, parsed.data.save.questStatus, parsed.data.save.inventory, parsed.data.save.boots, parsed.data.save.shields, parsed.data.save.tunics, parsed.data.save.swords)
          console.log(items)
          console.log(app.lastEvent);

          Object.keys(items).forEach((key) => {
            if (app.local.world.items[key] === undefined) return // Ignore any keys not within the item manager.
            app.local.world.items[key].Set(items[key] * 1)
          })

          app.local.world.save = parsed.data.save // Overwrite the local save with the parsed save.
          console.log(app.local.world)
          app.emit('items updated', app.local.world.items)
          break
        
        case ElectronPayloads.COLLECTABLE_COLLECTED:
        case ElectronPayloads.EVENT_TRIGGERED:
        case ElectronPayloads.SKULLTULA_COLLECTED:
        case ElectronPayloads.CHEST_OPENED:
        case ElectronPayloads.SHOPNUT_BOUGHT:
          app.lastEvent = { payload: parsed.payload, data: JSON.parse(parsed.data.data) } // Make data to be created.

          app.local.world.locations.Accessible(false, false, app.global.scene).forEach((location) => {
            if (JSON.stringify(location.event) == JSON.stringify(app.lastEvent)) location.completed = true
          })

          console.log(app.lastEvent);

          app.emit('chest opened')
          break

        case ElectronPayloads.SCENE_UPDATED:
          app.emit('scene updated', parsed.data.scene)
          break

        case ElectronPayloads.OTHER_TRACKER_UPDATE:
          console.log('Received other map tracker')
          console.log(parsed)

          if (app.worlds[parsed.data.world] === app.local.world) { return } // Prevent lost progress through mistakes or attempted trolls.
          app.worlds[parsed.data.world].save = parsed.data.save

          this.Deserialize(app.worlds[parsed.data.world], parsed.data)
          console.log(parsed.data)
          break

        case ElectronPayloads.CONNECTION_UPDATE: // Connection payload
          app.emit('connection updated', parsed.data)
          break
      }
    })
  }

  /**
   * Serialize a provided map into an array of integer-represented booleans.
   * @param {*} map Map to serialize.
   * @param {*} data Property within map to serialize (e.g. 'completed').
   * @returns {Array} Array of booleans.
   */
  Serialize (map, data) {
    return MapToArray(map).map((value) => value[data] ? 1 : 0)
  }

  Deserialize (world, data) {
    if (!world) { return app.worlds.push(new GameWorld(app)) } // If the world doesn't exist, push another.

    Object.keys(data.save.inventory).forEach((key) => world.items[key].Set(data.save.inventory[key])) // Assign the inventory.
    world.locations.Array().forEach((location, index) => { location.completed = data.locations[index] }) // Assign the locatiom completion data.
  }
}

app.networking = new NetworkManager()

export default app
