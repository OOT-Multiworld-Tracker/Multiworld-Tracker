import { App } from '../app'
import { ItemManager, LocationManager } from '../AppManagers'

/**
 * A player world instance. Controls everything related to worlds.
 */
export class GameWorld {
  constructor (app) {
    /**
     * The application instance.
     * @type {App}
     */
    this.app = app

    this.save = {
      world_time: 11112,
      world_night_flag: false,
      death_counter: 0,
      player_name: 'Link',
      heart_containers: 3,
      health: 12,
      magic_meter_size: 0,
      magic_current: 0,
      rupee_count: 0,
      age: 0
    }

    /**
     * The player's currently held items
     * @type {ItemManager}
     */
    this.items = new ItemManager(this)

    /**
     * The player's location list
     * @type {LocationManager}
     */
    this.locations = new LocationManager(this)
    this.dungeons = [{ name: 'Deku Tree', mq: false }, { name: "Dodongo's Cave", mq: false }, { name: 'Bottom of the Well', mq: false }, { name: "Jabu Jabu's Belly", mq: false }, { name: 'Forest Temple', mq: false }, { name: 'Fire Temple', mq: false }, { name: 'Water Temple', mq: false }, { name: 'Shadow Temple', mq: false }, { name: 'Spirit Temple', mq: false }, { name: 'Ice Cavern', mq: false }, { name: 'GTG', mq: false }, { name: "Ganon's Castle", mq: false }]
  }

  /**
   * Synchronizes the game world with the other trackers.
   */
  Sync () {
    // Announce the current save-status of your tracker to other trackers.
    this.app.networking.Send({
      world: this.app.worlds[this.app.global.world],
      save: this.save,
      locations: this.locations.Array().map((location) => { return { completed: location.completed, item: location.item, display: location.display, name: location.name, preExit: location.preExit, scene: location.scene } }),
      dungeons: this.dungeons,
      items: this.items
    })
  }
}
