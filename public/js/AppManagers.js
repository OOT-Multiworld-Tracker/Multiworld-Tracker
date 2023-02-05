import ValueSwitch from './classes/ValueSwitch'
import { Item } from './classes/Item'
import { MapToArray } from './Utils'
import GameManager from './classes/GameManager'
import Parser from './classes/Parser'
import { GameWorld } from './classes/GameWorld'

export class SettingsManager {
  constructor (spoiler) {
    if (spoiler) {
      Object.keys(this).forEach(key => {
        if (spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]) {
          this[key].value = spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]
        }
      })
    }

    this.addSetting = this.addSetting.bind(this)
    this.MakeSpecialValues = this.MakeSpecialValues.bind(this)
    this.makeSettings()
  }

  makeSettings () {
    GameManager.GetSelectedGame().settings.forEach(this.addSetting)
  }

  addSetting (setting) {
    if (typeof setting !== 'object') { // No special manipulations.
      this[setting.toLowerCase()] = new ValueSwitch(setting, [0, 1])
      return
    }

    const values = setting.values

    if (!setting.name || !Array.isArray(values)) { throw new Error('Item has failed to generate: Item must have a name and values must be an array') }

    values.forEach(value => this.MakeSpecialValues(value, values))

    this[setting.name.toLowerCase()] = new ValueSwitch(setting.name, values)
  }

  MakeSpecialValues (value, values) {
    // Turn a 2-piece array into a list of values.
    if (Array.isArray(value)) { for (let i = value[0]; i <= value[1]; i++) values.push(i) }
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
    this.makeItems()
  }

  makeItems () {
    GameManager.GetSelectedGame().items.forEach((item) => {
      if (typeof item !== 'object') {
        this[item.toLowerCase().replace(/ /g, '')] = new Item(item, [0, 1])
        return
      }

      return this.addItem(item)
    })
  }

  addItem (item) {
    const values = item.values

    if (item.type && item.type === 'dungeon') {
      this[item.name.toLowerCase().replace(/ /g, '')] = new KeyManager(item.name, item.max)
      return
    }

    const category = item.category || null

    this[item.name.toLowerCase().replace(/ /g, '')] = new Item(item.name, values, category)
  }

  MakeSpecialValues (value, values) {
    // Split items
    if (Array.isArray(value)) {
      for (let i = value[0]; i <= value[1]; i++) values.push(i)
    }
  }

  Set (items) {
    Object.keys(this).forEach(key => {
      if (this[key] === undefined || !(this[key] instanceof Item)) { return } // Ignore any keys not within the item manager.

      this[key].Set(items[key].value * 1)
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
    this.world = world || new GameWorld()

    /**
     * The locations in this world.
     * @type {Location[]}
     */
    this.locations = Parser.ParseLocations(this)

    this.CheckMixin = this.CheckMixin.bind(this)
    this.CheckLogic = this.CheckLogic.bind(this)
    this.CheckItem = this.CheckItem.bind(this)
    this.CheckSetting = this.CheckSetting.bind(this)
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
      (location.scene === scene || scene === -1) && (((this.world.app.global.settings.hideUnavaliable && this.world.app.global.settings.hideUnavaliable.value === false) || this.IsAccessible(location, this.world)) && ((complete === false && location.completed === false) || (complete === true && location.completed))))
  }

  /**
   * List all marked and unmarked by scene
   * @param {*} scene
   */
  GetScene (scene) {
    return this.Array().filter(location => (location.scene === scene || scene === -1))
  }

  /**
   * Checks if the item within a world is accessible
   * @param {Object} location
   * @param {GameWorld} world
   * @returns {Boolean}
   */
  IsAccessible (location, world) {
    const logic = location.logic

    if (!location.preExit && !this.CheckMixin({ name: 'CanLeaveForest' })) return false // If the location is not a pre-exit, check if the player can leave the forest.

    return this.CheckLogic(logic)
  }

  /**
   * Evaluate a logic line.
   * @param {string[]||object[]} logic
   */
  CheckLogic (logic) {
    if (!logic) return true // No logic = OK

    const logicTypes = {
      mixin: this.CheckMixin,
      item: this.CheckItem,
      setting: this.CheckSetting,
      dungeon: this.CheckDungeon
    }

    let index = 0

    for (const log of logic) {
      if (log === '||' || logicTypes[log.type] === undefined || logicTypes[log.type](log)) {
        // Handle ors
        if (log === '||') {
          const lastLogic = logic[index - 1]
          const nextLogic = logic[index + 1]

          if (logicTypes[lastLogic.type](lastLogic) || logicTypes[nextLogic.type](nextLogic)) {
            return true
          }
        }
        index++
        continue
      }

      if (logic.length !== 1 && logic[index + 1] === '||') { index++; continue } // If this is part of an OR logic, don't consider it individually

      return false
    }

    return true
  }

  /**
   * @private
   */
  CheckMixin (log) {
    if (!GameManager.GetSelectedGame().mixins[log.name]) return console.warn('Mixin not found: ' + log.name)
    return this.CheckLogic(GameManager.GetSelectedGame().mixins[log.name].logic)
  }

  /**
   * @private
   */
  CheckItem (log) {
    if (!this.world) return
    if (!this.world.items[log.name.toLowerCase().replace(/ /g, '')]) return console.warn('Item not found: ' + log.name.toLowerCase().replace(/ /g, ''))
    if (this.world.items[log.name.toLowerCase().replace(/ /g, '')].Index() >= log.index) return true
    return false
  }

  /**
   * @private
   */
  CheckSetting (log) {
    if (!this.world) return
    if (!this.world.app.global.settings[log.name.toLowerCase()]) return console.warn('Setting not found: ' + log.name)
    if (this.world.app.global.settings[log.name.toLowerCase()].Index() >= log.index) return true
    return false
  }

  CheckDungeon (log) {
    if (!this.world) return
    return true
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
    return this.Array().filter(location => (location.scene === scene || scene === -1) && location.completed === completed)
  }

  Set (locations) {
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
    // if (!this.untrackable) Parser.addLocationID(this.id, this.manager.world.app.lastEvent) // Add the ID of the last event to the location.json
    this.manager.world.Sync()
    this.manager.world.app.call('locations update', this.manager)
  }
}
