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
   * @async
   */
  Sync () {
    return new Promise((resolve, reject) => {
      // Announce the current save-status of your tracker to other trackers.
      this.world.app.networking.Send({
        world: this.world.app.worlds.indexOf(this.world.app.local.world),
        save: this.world.save,
        locations: this.world.locations,
        dungeons: this.world.dungeons,
        items: this.world.items
      })

      resolve()
    })
  }
}
