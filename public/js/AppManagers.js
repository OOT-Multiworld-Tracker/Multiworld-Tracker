import ValueSwitch from './classes/ValueSwitch'
import { Item, Bottle, TradeItem } from './classes/Item'
import { MapToArray } from './Utils'
import GameManager from './classes/GameManager'
import Parser from './classes/Parser'
import { GameWorld } from './classes/GameWorld'

const CATEGORIES = {
  SHIELDS: 'Shields',
  TUNICS: 'Tunics',
  SWORDS: 'Swords',
  BOW: 'Bow & Arrows',
  MAGIC: 'Magic',
  BOMBS: 'Bombs',
  BOOTS: 'Boots',
  SONGS: 'Songs',
  WARP_SONGS: 'Warp Songs',
  COLLECTABLES: 'Collectables',
  DUNGEON: 'Dungeon',
}

export class SettingsManager {
  constructor (spoiler) {
    if (spoiler) {
      Object.keys(this).forEach(key => {
        if (spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]) {
          this[key].value = spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]
        }
      })
    }

    this.makeSettings();
  }

  makeSettings () {
    GameManager.GetSelectedGame().settings.forEach ( setting => {
      if (typeof setting !== 'object') // No special manipulations.
        return this[setting.toLowerCase()] = new ValueSwitch(setting, [0, 1]);

      if (!setting.name) // Force the item to have a name.
        throw new Error('Item has failed to generate: Item must have a name');

      const values = setting.values || [];

      if (!Array.isArray(values)) // Values must be an array.
        throw new Error('Item has failed to generate: Item values must be an array');

      values.forEach( value => { // Make special value type.
      
        if (Array.isArray ( value )) // Turn a 2-piece array into a list of values.
          for (let i = value[0]; i <= value[1]; i++) values.push(i);
      
      });

      this[setting.name.toLowerCase()] = new ValueSwitch(setting.name, values);
    })
  }

  Serialize () {
    const map = {}
    Object.keys(this).forEach(key => {
      map[this[key].name.toLowerCase().replace(/ /g, '_')] = this[key].value
    })
    return map
  }
}

export class KeyManager {
  constructor (dungeon, maxKeys) {
    this.name = dungeon
    this.smallKeys = new Item('Small Key', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((num) => num <= maxKeys))
    this.bigKey = new Item('Boss Key', [0, 1])
  }
}

export class ItemManager {
  constructor (world) {
    this.makeItems();
  }

  makeItems () {
    GameManager.GetSelectedGame().items.forEach (item => {
      if (typeof item !== 'object') // No special manipulations.
        return this[item.toLowerCase()] = new Item(item, [0, 1]);

      if (!item.name) // Force the item to have a name.
        throw new Error('Item has failed to generate: Item must have a name');

      if (item.type && item.type == 'dungeon') {
        return this[item.name.toLowerCase()] = new KeyManager(item.name, item.max);
      }

      const values = item.values || [];

      if (!Array.isArray(values)) // Values must be an array.
        throw new Error('Item has failed to generate: Item values must be an array');

      // Make special value type.
      values.forEach( (value, index) => {
      
        if (Array.isArray ( value )) // Turn a 2-piece array into a list of values.
          for (let i = value[0]; i <= value[1]; i++) values.push(i);
      
      });

      const category = item.category || null;

      this[item.name.toLowerCase()] = new Item(item.name, values, category);
    })
  }

  Set (items) {
    Object.keys(this).forEach( key => {
      if (this[ key ] === undefined || !(this[ key ] instanceof Item)) 
        return // Ignore any keys not within the item manager.

      this[ key ].Set( items[ key ].value * 1 )
    })
  }
}

/**
 * The base manager that controls locations and spoilers.
 */
export class LocationManager {
  constructor (world) {
    /**
     * The world this location manager is for.
     * @type {GameWorld}
     */
    this.world = world

    /**
     * The locations in this world.
     * @type {Location[]}
     */
    this.locations = Parser.ParseLocations(this)
  }

  /**
   * Returns a map of the available items
   * @returns {Map[Location]}
   */
  All () {
    return this.locations
  }

  /**
   * Returns a full array of the location items
   * @returns {Location[]}
   */
  Array () {
    return MapToArray(this.locations)
  }

  /**
  / Lists all accessible locations for the world. Filters by save and accessibility.
  / @returns {Location[]}
  */
  Accessible (complete = false, showItems = false, scene = -1) {
    return this.Array().filter(location =>
      (location.scene == scene || scene == -1) && ((this.world.app.global.settings.hideUnavaliable && this.world.app.global.settings.hideUnavaliable.value == false || this.IsAccessible(location, this.world)) && (complete == false && location.completed == false) || (complete == true && location.completed)))
  }

  /**
   * List all marked and unmarked by scene
   * @param {*} scene
   */
  GetScene (scene) {
    return this.Array().filter(location => (location.scene == scene || scene == -1))
  }

  /**
   * Checks if the item within a world is accessible
   * @param {Object} location
   * @param {GameWorld} world
   * @returns {Boolean}
   */
  IsAccessible (location, world) {
    const logic = location.logic;

    return this.CheckLogic(logic)
  }

  /**
   * Evaluate a logic line.
   * @param {string[]||object[]} logic 
   */
  CheckLogic (logic) {
    if (!logic) return true; // No logic = OK

    const logicTypes = {
      'mixin': this.CheckMixin,
      'item': this.CheckItem,
      'setting': this.CheckSetting, 
    }

    for (let log of logic) {
      if (logicTypes[logic.type](logic)) continue;
      return false;
    }

    return true;
  }

  /**
   * @private
   */
  CheckMixin (log) {
    if (!GameManager.GetSelectedGame().mixins[log.name]) return console.warn("Mixin not found: " + log.name);
    return this.CheckLogic(GameManager.GetSelectedGame().mixins[log.name].logic)
  }

  /**
   * @private
   */
  CheckItem () {
    if (!this.world.items[log.name.toLowerCase()]) return console.warn("Item not found: " + log.name);
    if (this.world.items[log.name.toLowerCase()].Index() >= log.index) return true;
    return false;
  }

  /**
   * @private
   */
  CheckSetting () {
    if (!this.world.app.global.settings[log.name.toLowerCase()]) return console.warn("Setting not found: " + log.name);
    if (this.world.app.global.settings[log.name.toLowerCase()].Index() >= log.index) return true;
    return false;
  }

  /**
   * Toggle the completion status on/off for a location
   * @param {String} id
   * @deprecated
   */
  ToggleCompleted (id) {
    this.Array()[id].Mark()
  }

  /**
   * Returns a list of all of the items that contains all of the keywords.
   * @param {String} term A full string containing keywords
   * @returns {Location[]}
   */
  Search (term, scene = -1, page = 0) {
    const keywords = term.split(' ')

    return (page === 0 ? this.Accessible(false, false, scene) : this.Get(true, scene)).filter((location) => {
      let valid = true
      keywords.forEach(keyword => {
        if (!location.name.toLowerCase().includes(keyword.toLowerCase()) && !(location.display && location.display.name.toLowerCase().includes(keyword.toLowerCase()))) {
          valid = false
        }
      })
      return valid
    })
  }

  /**
   * Returns a list of locations based on completion flag.
   * @param {boolean} completed Completion flag
   * @returns {Location[]}
   */
  Get (completed = false, scene = -1) {
    return this.Array().filter(location => (location.scene == scene || scene == -1) && location.completed === completed)
  }

  Set (locations) {
    console.log(locations);
    locations.forEach((location, index) => 
          Object.assign(this.locations.get(String(index)), location))
  }
}

export class Location {
  constructor (manager, data) {
    /**
     * The manager this location is for.
     * @type {LocationManager}
     */
    this.manager = manager

    /**
     * The name of the location.
     * @type {string}
     */
    this.name = data.name

    /**
     * The id of the location.
     * @type {string}
     */
    this.id = data.id

    /**
     * The scene of the location.
     * @type {string}
     */
    this.scene = data.scene

    /**
     * Whether the location is accessible before exiting the forest.
     * @type {boolean}
     */
    this.preExit = data.preExit

    /**
     * Whether the location is completed.
     * @type {boolean}
     */
    this.completed = false

    /**
     * Whether the location is accessible.
     * @type {boolean}
     */
    this.logic = data.logic

    /**
     * Auto tracking event
     */
    this.event = data.event

    /**
     * Untrackable?
     */
    this.untrackable = data.untrackable
  }

  /**
   * Toggle the mark status of the location.
   */
  Mark () {
    this.completed = !this.completed
    //if (!this.untrackable) Parser.addLocationID(this.id, this.manager.world.app.lastEvent) // Add the ID of the last event to the location.json
    this.manager.world.Sync()
    this.manager.world.app.call('locations update', this.manager)
  }
}
