import { ElectronPayloads } from '../enum/EnumPayloads'
import { MapToArray } from '../Utils'
import { GameWorld } from './GameWorld'

export class NetworkManager {
  constructor (app) {
    this.app = app

    require('electron').ipcRenderer.on('packet', (_, data) => {
      const parsed = JSON.parse(String(data))
      let items

      switch (parsed.payload) {
        case ElectronPayloads.SAVE_UPDATED:
          console.log(parsed)
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

          this.app.global.world = parsed.data.world-1

          for (let i=this.app.global.world; i>0; i--) {
            this.app.worlds.shift(new GameWorld(this.app))
          }

          this.app.local.world.save = parsed.data.save // Overwrite the local save with the parsed save.
          this.app.emit('items updated', this.app.local.world.items)
          this.app.local.world.Sync()
          break

        case ElectronPayloads.COLLECTABLE_COLLECTED:
        case ElectronPayloads.EVENT_TRIGGERED:
        case ElectronPayloads.SKULLTULA_COLLECTED:
        case ElectronPayloads.CHEST_OPENED:
        case ElectronPayloads.SHOPNUT_BOUGHT:
        case ElectronPayloads.SWITCH_CHANGED:
          this.app.lastEvent = { payload: parsed.payload, scene: parsed.data.scene, data: JSON.parse(parsed.data.data) } // Make data to be created.

          this.app.local.world.locations.Accessible(false, false, parsed.data.scene).forEach((location) => {
            if (JSON.stringify(location.event.data) == JSON.stringify(this.app.lastEvent.data)) location.completed = true // If the events match then mark as complete.
          })

          this.app.emit('chest opened')
          this.app.local.world.Sync()
          break

        case ElectronPayloads.SCENE_UPDATED:
          this.app.emit('scene updated', parsed.data.scene)
          this.app.local.world.scene = parsed.data.scene
          this.app.local.world.Sync()
          break

        case ElectronPayloads.OTHER_TRACKER_UPDATE:
          console.log('Received other map tracker')
          console.log(parsed)

          if (this.app.worlds[parsed.data.world] === this.app.local.world) { return } // Prevent lost progress through mistakes or attempted trolls.
          if (this.app.worlds.length-1 < parsed.data.world) { this.app.worlds.push(new GameWorld(this.app)) }
          this.app.worlds[parsed.data.world].save = parsed.data.save
          this.app.worlds[parsed.data.world].scene = parsed.data.scene

          this.Deserialize(this.app.worlds[parsed.data.world], parsed.data)
          console.log(this.app)
          this.app.emit('world added', this.app.worlds)
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
    require('electron').ipcRenderer.send('packets', JSON.stringify(data))
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

    const items = Object.assign({}, // Assign all of the items to the savefile.
      data.save.questStatus,
      data.save.inventory,
      data.save.boots,
      data.save.shields,
      data.save.tunics,
      data.save.swords
    )

    console.log(items)

    Object.keys(items).forEach((key) => {
      if (world.items[key] === undefined) return // Ignore any keys not within the item manager.
      world.items[key].Set(items[key] * 1)
    })

    world.locations.Array().forEach((location, index) => { location.completed = data.locations[index].completed }) // Assign the locatiom completion data.
  }
}
