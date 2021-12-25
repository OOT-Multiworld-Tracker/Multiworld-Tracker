import ValueSwitch from './classes/ValueSwitch'
import { Item, Bottle, TradeItem } from './classes/Item'
import { MapToArray } from './Utils'
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
    /**
     * Progression-related settings
     */
    this.openForest = new ValueSwitch('Open Forest', ['closed', 'open deku', 'open forest'])
    this.openKakariko = new ValueSwitch('Open Kakariko', ['closed', 'open'])
    this.openDoorOfTime = new ValueSwitch('Open Door Of Time', [false, true])
    this.zoraFountain = new ValueSwitch('Zora Fountain', ['closed', 'open adult', 'open child'])
    this.gerudoFortress = new ValueSwitch('Gerudo Fortress', ['vanilla', 'fast', 'open'])

    /**
     * Win conditions
     */
    this.bridge = new ValueSwitch('Bridge', ['vanilla', 'stones', 'medallions', 'skulltulas', 'open'])
    this.bridgeStones = new ValueSwitch('Bridge Stones', [0, 1, 2, 3, 4, 5, 6])

    /**
     * Bombchus able to be used in-place of bombs.
     */
    this.bombchusInLogic = new ValueSwitch('Bombchus in Logic', [false, true])

    /**
     * Whether or not to skip zelda -- removes items from pool.
     */
    this.skipChildZelda = new ValueSwitch('Skip Child Zelda', [false, true])

    /**
     * Shuffle settings for items / changes avaliable item pool.
     */
    this.shuffleCows = new ValueSwitch('Shuffle Cows', [false, true])
    this.shuffleBeans = new ValueSwitch('Shuffle Beans', [false, true])
    this.shuffleMedigoronCarpetSalesman = new ValueSwitch('Shuffle Medigoron Carpet Salesman', [false, true])
    this.shuffleScrubs = new ValueSwitch('Shuffle Scrubs', [false, 'low', 'high'])

    /**
     * Tracker specific options
     */
    this.itemHints = new ValueSwitch('Item Hints', [false, 'highlight important', 'show items'])
    this.playerHints = new ValueSwitch('Player Hints', [false, true])
    this.followCurrentScene = new ValueSwitch('Follow Current Scene', [true, false])
    this.hideUnavaliable = new ValueSwitch('Hide Unavaliable', [true, false])
    this.hideEra = new ValueSwitch('Only Current Age', [false, true])

    /**
      * Shuffle settings for items / changes avaliable item pool.
     */
    this.shopSanity = new ValueSwitch('Shop Sanity', ['none', 1, 2, 3, 4])
    this.tokenSanity = new ValueSwitch('Token Sanity', ['vanilla', 'dungeon', 'overworld', 'all'])

    this.entranceSanity = new ValueSwitch('Entrance Sanity', [false, true])

    if (spoiler) {
      Object.keys(this).forEach(key => {
        if (spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]) {
          this[key].value = spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]
        }
      })
    }
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
  constructor (dungeon) {
    this.name = dungeon
    this.smallKeys = new Item('Small Key', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.bigKey = new Item('Big Key', [0, 1])
  }
}

export class ItemManager {
  constructor (world) {
    /**
     * Basic major items.
     */
    this.dekuSticks = new Item('Deku Sticks', [0, 10, 20, 30])
    this.dekuNuts = new Item('Deku Nuts', [0, 20, 30, 40])
    this.bombs = new Item('Bomb Bag', [0, 30, 40, 50], CATEGORIES.BOMBS)
    this.bombchus = new Item('Bombchus', [0, 20], CATEGORIES.BOMBS)
    this.magicBeans = new Item('Magic Beans', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    this.fairySlingshot = new Item('Slingshot', [0, 20, 30, 40])
    this.fairyBow = new Item('Bow', [0, 30, 40, 50], CATEGORIES.BOW)
    this.fireArrows = new Item('Fire Arrows', [0, 1], CATEGORIES.BOW)
    this.iceArrows = new Item('Ice Arrows', [0, 1], CATEGORIES.BOW)
    this.lightArrows = new Item('Light Arrows', [0, 1], CATEGORIES.BOW)
    this.dinsFire = new Item('Dins Fire', [0, 1], CATEGORIES.MAGIC)
    this.faroresWind = new Item('Faroress Wind', [0, 1], CATEGORIES.MAGIC)
    this.nayrusLove = new Item('Nayrus Love', [0, 1], CATEGORIES.MAGIC)
    this.ocarina = new Item('Ocarina', [0, 'Saria\'s Ocarina', 'Ocarina of Time'])
    this.hookshot = new Item('Hookshot', [0, 'Hookshot', 'Longshot'])
    this.lensOfTruth = new Item('Lens of Truth', [0, 1], CATEGORIES.MAGIC)
    this.boomerang = new Item('Boomerang', [0, 1])
    this.megatonHammer = new Item('Megaton Hammer', [0, 1])

    /**
     * A list of bottles on a special class denoting all bottle values.
     */
    this.bottle_1 = new Bottle('Bottle')
    this.bottle_2 = new Bottle('Bottle')
    this.bottle_3 = new Bottle('Bottle')
    this.bottle_4 = new Bottle('Bottle')

    this.rutosLetter = new Item('Rutos Letter', [0, 1])

    /**
     * All of the trade items.
     */
    this.childTradeItem = new TradeItem('Child Trading')
    this.adultTradeItem = new TradeItem('Adult Trading')

    this.wallet = new Item('Wallet', [99, 200, 500, 999])
    this.swimming = new Item('Progressive Scale', [0, 'Silver Scale', 'Gold Scale'])
    this.strength = new Item('Progressive Strength', [0, 'Goron\'s Bracelet', 'Silver Gauntlet', 'Golden Gauntlet'])

    /**
     * Swords
     */
    this.kokiriSword = new Item('Kokiri Sword', [0, 1], CATEGORIES.SWORDS)
    this.masterSword = new Item('Master Sword', [0, 1], CATEGORIES.SWORDS)
    this.biggoronSword = new Item('Biggoron Sword', [0, 1], CATEGORIES.SWORDS)

    /**
     * Tunics
     */
    this.goronTunic = new Item('Goron Tunic', [0, 1], CATEGORIES.TUNICS)
    this.zoraTunic = new Item('Zora Tunic', [0, 1], CATEGORIES.TUNICS)

    /**
     * Shields
     */
    this.dekuShield = new Item('Deku Shield', [0, 1], CATEGORIES.SHIELDS)
    this.hylianShield = new Item('Hylian Shield', [0, 1], CATEGORIES.SHIELDS)
    this.mirrorShield = new Item('Mirror Shield', [0, 1], CATEGORIES.SHIELDS)

    this.ironBoots = new Item('Iron Boots', [0, 1], CATEGORIES.BOOTS)
    this.hoverBoots = new Item('Hover Boots', [0, 1], CATEGORIES.BOOTS)

    /**
     * Quest Status Items
     */
    this.gerudoMembershipCard = new Item('Gerudo Membership Card', [0, 1])
    this.stoneOfAgony = new Item('Stone of Agony', [0, 1])
    this.goldSkulltulas = new Item('Gold Skulltulas', [0, 10, 20, 30, 40, 50], CATEGORIES.COLLECTABLES)
    this.heartPieces = new Item('Heart Pieces', [0, 4, 8, 12, 16, 20, 24, 28, 32], CATEGORIES.COLLECTABLES)

    /**
     * Songs
     */
    this.zeldasLullaby = new Item('Zeldas Lullaby', [0, 1], CATEGORIES.SONGS)
    this.eponasSong = new Item('Eponas Song', [0, 1], CATEGORIES.SONGS)
    this.sunsSong = new Item('Suns Song', [0, 1], CATEGORIES.SONGS)
    this.sariasSong = new Item('Sarias Song', [0, 1], CATEGORIES.SONGS)
    this.songOfTime = new Item('Song Of Time', [0, 1], CATEGORIES.SONGS)
    this.songOfStorms = new Item('Song Of Storms', [0, 1], CATEGORIES.SONGS)
    this.preludeOfLight = new Item('Prelude Of Light', [0, 1], CATEGORIES.WARP_SONGS)
    this.minuetOfForest = new Item('Minuet Of Forest', [0, 1], CATEGORIES.WARP_SONGS)
    this.boleroOfFire = new Item('Bolero Of Fire', [0, 1], CATEGORIES.WARP_SONGS)
    this.serenadeOfWater = new Item('Serenade Of Water', [0, 1], CATEGORIES.WARP_SONGS)
    this.nocturneOfShadow = new Item('Nocturne Of Shadow', [0, 1], CATEGORIES.WARP_SONGS)
    this.requiemOfSpirit = new Item('Requiem Of Spirit', [0, 1], CATEGORIES.WARP_SONGS)
    this.kokiriEmerald = new Item('Kokiri Emerald', [0, 1], CATEGORIES.DUNGEON)
    this.goronRuby = new Item('Goron Ruby', [0, 1], CATEGORIES.DUNGEON)
    this.zoraSapphire = new Item('Zora Sapphire', [0, 1], CATEGORIES.DUNGEON)
    this.lightMedallion = new Item('Light Medallion', [0, 1], CATEGORIES.DUNGEON)
    this.forestMedallion = new Item('Forest Medallion', [0, 1], CATEGORIES.DUNGEON)
    this.waterMedallion = new Item('Water Medallion', [0, 1], CATEGORIES.DUNGEON)
    this.fireMedallion = new Item('Fire Medallion', [0, 1], CATEGORIES.DUNGEON)
    this.spiritMedallion = new Item('Spirit Medallion', [0, 1], CATEGORIES.DUNGEON)
    this.shadowMedallion = new Item('Shadow Medallion', [0, 1], CATEGORIES.DUNGEON)

    /**
     * Key lists
     */
    this.forestTemple = new KeyManager('Forest Temple')
    this.fireTemple = new KeyManager('Fire Temple')
    this.waterTemple = new KeyManager('Water Temple')
    this.spiritTemple = new KeyManager('Spirit Temple')
    this.shadowTemple = new KeyManager('Shadow Temple')
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
      (location.scene == scene || scene == -1) && ((this.world.app.global.settings.hideUnavaliable.value == false || this.IsAccessible(location, this.world)) && (complete == false && location.completed == false) || (complete == true && location.completed)))
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
    return (location && (location.preExit === true || CanExitForest(world)) && ((!location.logic || location.logic(world)) && !location.completed))
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
    if (!this.untrackable) Parser.addLocationID(this.id, this.manager.world.app.lastEvent) // Add the ID of the last event to the location.json
    this.manager.world.Sync()
    this.manager.world.app.call('locations update', this.manager)
  }
}
