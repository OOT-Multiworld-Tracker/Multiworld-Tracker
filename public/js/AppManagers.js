import ValueSwitch from './ValueSwitch'
import { Item, Bottle, TradeItem } from './Item'
import { MapToArray } from './Utils'
import Parser from './Parser'

export class SettingsManager {
  constructor (spoiler) {
    console.log(spoiler)
    this.openForest = new ValueSwitch('Open Forest', ['open', 'closed'])
    this.openKakariko = new ValueSwitch('Open Kakariko', ['open', 'closed'])
    this.openDoorOfTime = new ValueSwitch('Open Door Of Time', [false, true])
    this.zoraFountain = new ValueSwitch('Zora Fountain', ['open', 'closed'])
    this.gerudoFortress = new ValueSwitch('Gerudo Fortress', ['vanilla', 'fast', 'open'])
    this.bridge = new ValueSwitch('Bridge', ['vanilla', 'stones', 'medallions', 'skulltulas', 'open'])
    this.bridgeStones = new ValueSwitch('Bridge Stones', [0, 1, 2, 3, 4, 5, 6])
    this.triforceHunt = new ValueSwitch('Triforce Hunt', [false, true])
    this.bombchusInLogic = new ValueSwitch('Bombchus in Logic', [false, true])
    this.skipChildZelda = new ValueSwitch('Skip Child Zelda', [false, true])
    this.shuffleKokiriSword = new ValueSwitch('Shuffle Kokiri Sword', [false, true])
    this.shuffleOcarinas = new ValueSwitch('Shuffle Ocarinas', [false, true])
    this.shuffleWeirdEgg = new ValueSwitch('Shuffle Weird Egg', [false, true])
    this.shuffleGerudoCard = new ValueSwitch('Shuffle Gerudo Card', [false, true])
    this.shuffleSongItems = new ValueSwitch('Shuffle Song Items', ['vanilla', 'shuffle', 'random'])
    this.shuffleCows = new ValueSwitch('Shuffle Cows', [false, true])
    this.shuffleBeans = new ValueSwitch('Shuffle Beans', [false, true])
    this.shuffleMedigoronCarpetSalesman = new ValueSwitch('Shuffle Medigoron Carpet Salesman', [false, true])
    this.shuffleScrubs = new ValueSwitch('Shuffle Scrubs', [false, 'low', 'high'])
    this.shopSanity = new ValueSwitch('Shop Sanity', ['none', 1, 2, 3, 4])
    this.tokenSanity = new ValueSwitch('Token Sanity', ['vanilla', 'dungeon', 'overworld', 'all'])

    if (spoiler) {
      Object.keys(this).forEach(key => {
        console.log(key)
        if (spoiler[this[key].name.toLowerCase().replace(/ /g, '_')]) {
          console.log(spoiler[this[key].name.toLowerCase().replace(/ /g, '_')])
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
    this.smallKeys = new Item('Small Key', [0, 1, 2, 3])
    this.bigKey = new Item('Big Key', [0, 1])
  }
}

export class ItemManager {
  constructor (world) {
    this.dekuSticks = new Item('Deku Sticks', [0, 10, 20, 30])
    this.dekuNuts = new Item('Deku Nuts', [0, 20, 30, 40])
    this.bombs = new Item('Bomb Bag', [0, 30, 40, 50])
    this.bombchus = new Item('Bombchus', [0, 20])
    this.magicBeans = new Item('Magic Beans', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    this.fairySlingshot = new Item('Slingshot', [0, 20, 30, 40])
    this.fairyBow = new Item('Bow', [0, 30, 40, 50])
    this.fireArrows = new Item('Fire Arrows', [0, 1])
    this.iceArrows = new Item('Ice Arrows', [0, 1])
    this.lightArrows = new Item('Light Arrows', [0, 1])
    this.dinsFire = new Item('Din\'s Fire', [0, 1])
    this.faroresWind = new Item('Farores\'s Wind', [0, 1])
    this.nayrusLove = new Item('Nayru\'s Love', [0, 1])
    this.ocarina = new Item('Ocarina', [0, 'Saria\'s Ocarina', 'Ocarina of Time'])
    this.hookshot = new Item('Hookshot', [0, 'Hookshot', 'Longshot'])
    this.lensOfTruth = new Item('Lens of Truth', [0, 1])
    this.boomerang = new Item('Boomerang', [0, 1])
    this.megatonHammer = new Item('Megaton Hammer', [0, 1])
    this.bottle_1 = new Bottle('Bottle 1')
    this.bottle_2 = new Bottle('Bottle 2')
    this.bottle_3 = new Bottle('Bottle 3')
    this.bottle_4 = new Bottle('Bottle 4')
    this.childTradeItem = new TradeItem('Child Trading')
    this.adultTradeItem = new TradeItem('Adult Trading')
    this.wallet = new Item('Wallet', [99, 200, 500, 999])
    this.swimming = new Item('Swimming', [0, 'Silver Scale', 'Gold Scale'])
    this.strength = new Item('Strength Upgrade', [0, 'Goron\'s Bracelet', 'Silver Gauntlet', 'Golden Gauntlet'])
    this.kokiriSword = new Item('Kokiri Sword', [0, 1])
    this.masterSword = new Item('Master Sword', [0, 1])
    this.biggoronSword = new Item('Biggoron Sword', [0, 1])
    this.goronTunic = new Item('Goron Tunic', [0, 1])
    this.zoraTunic = new Item('Zora Tunic', [0, 1])
    this.dekuShield = new Item('Deku Shield', [0, 1])
    this.hylianShield = new Item('Hylian Shield', [0, 1])
    this.mirrorShield = new Item('Mirror Shield', [0, 1])
    this.gerudoMembershipCard = new Item('Gerudo Membership Card', [0, 1])
    this.stoneOfAgony = new Item('Stone of Agony', [0, 1])
    this.goldSkulltulas = new Item('Gold Skulltulas', [0, 10, 20, 30, 40, 50])
    this.heartPieces = new Item('Heart Pieces', [0, 4, 8, 12, 16, 20, 24, 28, 32])
    this.zeldasLullaby = new Item('Zelda\'s Lullaby', [0, 1])
    this.eponasSong = new Item('Epona\'s Song', [0, 1])
    this.sunsSong = new Item('Sun\'s Song', [0, 1])
    this.sariasSong = new Item('Saria\'s Song', [0, 1])
    this.songOfTime = new Item('Song Of Time', [0, 1])
    this.songOfStorms = new Item('Song Of Storms', [0, 1])
    this.preludeOfLight = new Item('Prelude Of Light', [0, 1])
    this.minuetOfForest = new Item('Minuet Of Forest', [0, 1])
    this.boleroOfFire = new Item('Bolero Of Fire', [0, 1])
    this.serenadeOfWater = new Item('Serenade Of Water', [0, 1])
    this.nocturneOfShadow = new Item('Nocturne Of Shadow', [0, 1])
    this.requiemOfSpirit = new Item('Requiem Of Spirit', [0, 1])
    this.kokiriEmerald = new Item('Kokiri Emerald', [0, 1])
    this.goronRuby = new Item('Goron Ruby', [0, 1])
    this.zoraSapphire = new Item('Zora Sapphire', [0, 1])
    this.lightMedallion = new Item('Light Medallion', [0, 1])
    this.forestMedallion = new Item('Forest Medallion', [0, 1])
    this.waterMedallion = new Item('Water Medallion', [0, 1])
    this.fireMedallion = new Item('Fire Medallion', [0, 1])
    this.spiritMedallion = new Item('Spirit Medallion', [0, 1])
    this.shadowMedallion = new Item('Shadow Medallion', [0, 1])

    this.forestTemple = new KeyManager('Forest Temple')
    this.fireTemple = new KeyManager('Fire Temple')
    this.waterTemple = new KeyManager('Water Temple')
    this.spiritTemple = new KeyManager('Spirit Temple')
    this.shadowTemple = new KeyManager('Shadow Temple')
  }
}

export class TrackerSettings {
  constructor () {
    this.highlightImportantItems = new ValueSwitch('Highlight Important Items', [false, true])
  }
}

/**
 * The base manager that controls locations and spoilers.
 */
export class LocationManager {
  constructor (world, locations, spoiler) {
    this.world = world
    this.spoiler = spoiler
    this.locations = Parser.ParseLocations()
    console.log(this.locations)
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
    return this.Array().filter(location => (location.scene == scene || scene == -1) && (this.IsAccessible(location, this.world) && complete === false && !location.completed) || (complete && location.completed === true))
  }

  IsAccessible (location, world) {
    return (location && (location.preExit === true || CanExitForest(world)) && ((!location.logic || location.logic(world)) && !location.completed))
  }

  ToggleCompleted (props) {
    console.log(props.id)
    this.Array()[String(props.id)].completed = !this.Array()[String(props.id)].completed
    // Serialize and compress a packet for sending
    //if (window.isElectron) { require('electron').ipcRenderer.send('packets', JSON.stringify({ world: myWorld - 1, save: { swords: app.local.world.save.swords, shields: app.local.world.save.shields, inventory: app.local.world.save.inventory, questStatus: app.local.world.save.questStatus }, locations: NetworkSerialize(app.local.world.locations.Array(), 'completed') }).replace(/true/g, '1').replace(/false/g, '0')) }
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
        if (!location.name.toLowerCase().includes(keyword.toLowerCase())) {
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
