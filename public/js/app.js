class App {
  constructor () {
    this.local = {
      world: null,
      scene: -1
    }

    this.global = {
      settings: new SettingsManager()
    }

    this.worlds = [new GameWorld(save, dungeons)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]
  }

  RenderLocations (page, scene) {
    const accessible = app.local.world.locations.Accessible(locationList.state.page === 1, false, locationList.state.scene)
    locationList.setState({ accessible })
    eSidebar.setState({ accessible: accessible.length, completed: app.local.world.locations.Get(true).length })
  }

  SearchLocations (term) {
    locationList.setState({ search: term })
  }
}

/**
 * A player world instance. Controls everything related to worlds.
 */
class GameWorld {
  constructor (save, dungeons, locations) {
    this.save = save
    this.items = new ItemManager(this)
    this.locations = new LocationManager(this, locations)
    this.dungeons = [{ name: 'Deku Tree', mq: false }, { name: "Dodongo's Cave", mq: false }, { name: 'Bottom of the Well', mq: false }, { name: "Jabu Jabu's Belly", mq: false }, { name: 'Forest Temple', mq: false }, { name: 'Fire Temple', mq: false }, { name: 'Water Temple', mq: false }, { name: 'Shadow Temple', mq: false }, { name: 'Spirit Temple', mq: false }, { name: 'Ice Cavern', mq: false }, { name: 'GTG', mq: false }, { name: "Ganon's Castle", mq: false }]
  }
}

class ItemManager {
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

class KeyManager {
  constructor (dungeon) {
    this.name = dungeon
    this.smallKeys = new Item('Small Key', [0, 1, 2, 3])
    this.bigKey = new Item('Big Key', [0, 1])
  }
}

/**
 * A switch that can be toggled between many preset values before looping back to the first value.
 */
class ValueSwitch {
  constructor (name, values) {
    /**
     * @type {String}
     */
    this.name = name

    /**
    * @type {Object[]}
    */
    this.values = values
    this.value = this.values[0]
  }

  Index () {
    return this.values.indexOf(this.value)
  }

  Set (index) {
    this.value = this.values[index]
  }

  /**
   * Toggles through the avaliable values
   */
  Toggle () {
    const index = this.values.indexOf(this.value)

    if (index + 1 > this.values.length - 1) {
      this.value = this.values[0]
    } else {
      this.value = this.values[index + 1]
    }
  }
}

class Item extends ValueSwitch {
  Icon () {
    return `/images/${this.name.replace(' ', '_').toLowerCase()}.png`
  }
}

class TradeItem extends Item {
  constructor (name) {
    super(name, [0])
    this.values[0] = 0
    this.values[33] = 'Weird Egg'
    this.values[34] = 'Chicken'
    this.values[35] = 'Zelda\'s Letter'
    this.values[36] = 'Spooky Mask'
    this.values[37] = 'Keaton Mask'
    this.values[38] = 'Skull Mask'
    this.values[39] = 'Bunny Hood'
    this.values[40] = 'Zora Mask'
    this.values[41] = 'Goron Mask'
    this.values[42] = 'Gerudo Mask'
    this.values[43] = 'Mask of Truth'
    this.values[44] = 'Claim Check'
    this.values[255] = 'None'
  }
}

class Bottle extends Item {
  constructor (name) {
    super(name, [0])
    this.values[0] = 0
    this.values[1] = 1
    this.values[20] = 'Empty Bottle'
    this.values[21] = 'Red Potion'
    this.values[22] = 'Green Potion'
    this.values[23] = 'Blue Potion'
    this.values[24] = 'Fairy'
    this.values[25] = 'Fish'
    this.values[26] = 'Milk'
    this.values[27] = 'Ruto\'s Letter'
    this.values[28] = 'Blue Fire'
    this.values[29] = 'Bug'
    this.values[30] = 'Big Poe'
    this.values[31] = 'Milk'
    this.values[32] = 'Poe'
    this.values[255] = 'None'
  }
}

class SettingsManager {
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

/**
 * The base manager that controls locations and spoilers.
 */
class LocationManager {
  constructor (world, spoiler) {
    this.world = world
    this.spoiler = spoiler
    this.locations = ParseLocations(new Map(), this.spoiler)
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
  Accessible (complete = false, showItems = false, scene = locationList.state.scene) {
    return this.Array().filter(location => (location.scene == scene || scene == -1) && (IsAccessible(location, this.world) && complete === false && !location.completed) || (complete && location.completed === true))
  }

  /**
   * Returns a list of all of the items that contains all of the keywords.
   * @param {String} term A full string containing keywords
   * @returns {Location[]}
   */
  Search (term, scene = locationList.state.scene, page = locationList.state.page) {
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
