import { ElectronPayloads } from '../enum/EnumPayloads'
import { MapToArray } from '../Utils'
import { GameWorld } from './GameWorld'

export class NetworkManager {
  constructor (app) {
    /**
     * The application instance.
     * @type {import ('../app').App}
     */
    this.app = app

    require('electron').ipcRenderer.on('packet', (_, data) => {
      const parsed = JSON.parse(String(data))
      let items

      console.log(parsed)

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
            if (this.app.local.world.items[key.toLowerCase()] === undefined) return // Ignore any keys not within the item manager.
            this.app.local.world.items[key.toLowerCase()].Set(items[key] * 1)
          })

          this.app.global.world = parsed.data.world-1

          for (let i=this.app.global.world; i>this.app.worlds.length-1; i--) {
            this.app.worlds.unshift(new GameWorld(this.app))
            this.app.call('world update')
          }

          this.app.local.world.save = parsed.data.save // Overwrite the local save with the parsed save.
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

          this.app.local.world.Sync()
          break

        case ElectronPayloads.SCENE_UPDATED:
          this.AddEntrance(parsed.data.scene) // Add the entrance to the global entrances.
          this.app.local.world.scene = parsed.data.scene

          if (this.app.global.settings.followCurrentScene.value == true) this.app.local.world.call('change scene', parsed.data.scene)
          
          if (this.app.global.settings.entranceSanity.value == true) 
            this.app.call('entrance update')
            
          this.app.local.world.Sync()
          break

        case ElectronPayloads.OTHER_TRACKER_UPDATE:
          if (this.app.worlds[parsed.data.world] === this.app.local.world) { return } // Prevent lost progress through mistakes or attempted trolls.
          if (this.app.worlds.length-1 < parsed.data.world) { this.app.worlds.push(new GameWorld(this.app)) }
          this.app.worlds[parsed.data.world].save = parsed.data.save
          this.app.worlds[parsed.data.world].scene = parsed.data.scene

          this.Deserialize(this.app.worlds[parsed.data.world], parsed.data)
          this.app.worlds[parsed.data.world].call('update')
          break

        case ElectronPayloads.CONNECTION_UPDATE: // Connection payload
          this.app.call('connection', parsed.data)
          break
      }
    })
  }

  AddEntrance (to) {
    if (this.HasEntrance(this.app.local.world.scene, to)) return // Prevent duplicates.

    this.app.global.entrances.push([this.app.local.world.scene, to]) // Add the entrance to the global entrances.
  }

  HasEntrance (from, to) {
    console.log(this.app.global.entrances.find((entrance) => entrance[0] == from && entrance[1] == to));
    return this.app.global.entrances.find((entrance) => entrance[0] == from && entrance[1] == to) !== undefined
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
    
    Object.keys(items).forEach((key) => {
      if (world.items[key] === undefined) return // Ignore any keys not within the item manager.
      world.items[key].Set(items[key] * 1)
    })

    world.locations.Array().forEach((location, index) => { location.completed = data.locations[index].completed }) // Assign the locatiom completion data.
  }
}
