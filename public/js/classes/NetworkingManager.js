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

    require('electron').ipcRenderer.on('packet', this.OnPacket) // Start intaking packets.
  }

  OnSaveUpdated (data) {
    const items = Object.assign({}, // Assign all of the items to the savefile.
      data.save.questStatus,
      data.save.inventory,
      data.save.boots,
      data.save.shields,
      data.save.tunics,
      data.save.swords
    )

    this.app.local.world.items.Set(items)
    this.app.global.world = data.world-1

    for (let i=this.app.global.world; i>this.app.worlds.length-1; i--) {
      this.app.worlds.unshift(new GameWorld(this.app))
      this.app.call('world update')
    }

    this.app.local.world.save = data.save // Overwrite the local save with the parsed save.
    this.app.local.world.Sync()
  }

  OnEvent (parsed) {
    this.app.lastEvent = { payload: parsed.payload, scene: parsed.data.scene, data: JSON.parse(parsed.data.data) } // Make data to be created.

    this.app.local.world.locations.Accessible(false, false, parsed.data.scene).forEach((location) => {
      if (JSON.stringify(location.event.data) == JSON.stringify(this.app.lastEvent.data)) location.completed = true // If the events match then mark as complete.
    })

    this.app.local.world.Sync()
  }

  OnSceneUpdate (data) {
    this.AddEntrance(data.scene) // Add the entrance to the global entrances.
    this.app.local.world.scene = data.scene

    if (this.app.global.settings.followCurrentScene.value == true) this.app.local.world.call('change scene', data.scene)
    
    if (this.app.global.settings.entranceSanity.value == true) 
      this.app.call('entrance update')
      
    this.app.local.world.Sync()
  }

  OnOtherUpdate (data) { 
    if (this.app.worlds[data.world] === this.app.local.world) { return } // Prevent lost progress through mistakes or attempted trolls.
    if (this.app.worlds.length-1 < data.world) { this.app.worlds.push(new GameWorld(this.app)) }
    this.app.worlds[data.world].save = data.save
    this.app.worlds[data.world].scene = data.scene

    this.Deserialize(this.app.worlds[data.world], data)
    this.app.worlds[data.world].call('update')
  }

  OnPacket (event, data) {
    const parsed = JSON.parse(String(data))

    if (parsed.payload === ElectronPayloads.SAVE_UPDATED) return this.OnSaveUpdated(parsed.data);
    else if (parsed.payload === ElectronPayloads.SCENE_UPDATED) return this.OnEvent(parsed);
    else if (parsed.payload === ElectronPayloads.OTHER_TRACKER_UPDATE) return this.OnOtherUpdate(parsed.data);
    else if (parsed.payload === ElectronPayloads.CONNECTION_UPDATE) { this.app.call('connection', parsed.data) }
    else this.OnEvent(parsed);
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
