import { ElectronPayloads } from '../enum/EnumPayloads'
import { MapToArray } from '../Utils'
import { GameWorld } from './GameWorld'

export class NetworkManager {
  constructor (app) {
    this.app = app

    require('electron').ipcRenderer.on('packet', (_, data) => {
      console.log(data)
      const parsed = JSON.parse(data)
      console.log(parsed)
      let items

      switch (parsed.payload) {
        case ElectronPayloads.SAVE_UPDATED:
          items = Object.assign({}, // Assign all of the items to the savefile.
            parsed.data.save.questStatus,
            parsed.data.save.inventory,
            parsed.data.save.boots,
            parsed.data.save.shields,
            parsed.data.save.tunics,
            parsed.data.save.swords
          )

          Object.keys(items).forEach((key) => {
            if (this.app.local.world.items[key] === undefined) return // Ignore any keys not within the item manager.
            this.app.local.world.items[key].Set(items[key] * 1)
          })

          this.app.local.world.save = parsed.data.save // Overwrite the local save with the parsed save.
          this.app.emit('items updated', this.app.local.world.items)
          break

        case ElectronPayloads.COLLECTABLE_COLLECTED:
        case ElectronPayloads.EVENT_TRIGGERED:
        case ElectronPayloads.SKULLTULA_COLLECTED:
        case ElectronPayloads.CHEST_OPENED:
          this.app.lastEvent = { payload: parsed.payload, data: JSON.parse(parsed.data.data) } // Make data to be created.

          this.app.local.world.locations.Accessible(false, false, this.app.global.scene).forEach((location) => {
            if (JSON.stringify(location.event) == JSON.stringify(this.app.lastEvent)) location.completed = true // If the events match then mark as complete.
          })

          this.app.emit('chest opened')
          break

        case ElectronPayloads.SCENE_UPDATED:
          this.app.emit('scene updated', parsed.data.scene)
          break

        case ElectronPayloads.OTHER_TRACKER_UPDATE:
          console.log('Received other map tracker')
          console.log(parsed)

          if (this.app.worlds[parsed.data.world] === this.app.local.world) { return } // Prevent lost progress through mistakes or attempted trolls.
          this.app.worlds[parsed.data.world].save = parsed.data.save

          this.Deserialize(this.app.worlds[parsed.data.world], parsed.data)
          break

        case ElectronPayloads.CONNECTION_UPDATE: // Connection payload
          this.app.emit('connection updated', parsed.data)
          break
      }
    })
  }

  /**
   * Send a packet to the backend IPC handler.
   * @param {Object} data
   */
  Send (data) {
    require('electron').ipcRenderer.send('packet', JSON.stringify(data))
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
    if (!world) { return this.app.worlds.push(new GameWorld(this.app)) } // If the world doesn't exist, push another.

    Object.keys(data.save.inventory).forEach((key) => world.items[key].Set(data.save.inventory[key])) // Assign the inventory.
    world.locations.Array().forEach((location, index) => { location.completed = data.locations[index] }) // Assign the locatiom completion data.
  }
}
