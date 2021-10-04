class App {
  constructor () {
    this.local = {
      world: null,
      scene: -1
    }

    this.global = {
      settings
    }

    this.worlds = [new GameWorld(save, dungeons)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]
  }

  RenderLocations () {
    ReactDOM.render(<Locations />, document.getElementById('avaliable-root'))
    ReactDOM.render(<Locations completed='true' />, document.getElementById('completed-root'))
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
    this.dungeons = dungeons
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
    this.bottle_1 = new Item('Bottle 1', [0, 1])
    this.bottle_2 = new Item('Bottle 2', [0, 1])
    this.bottle_3 = new Item('Bottle 3', [0, 1])
    this.bottle_4 = new Item('Bottle 4', [0, 1])
    this.childTradeItem = new Item('Child Trading', [0, 34])
    this.adultTradeItem = new Item('Adult Trading', [0, 43])
    this.wallet = new Item('Wallet', [0, 99, 200, 500, 999])
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
    this.zeldaLullaby = new Item('Zelda\'s Lullaby', [0, 1])
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
    this.medallion = {
      light: new Item('Light Medallion', [0, 1]),
      forest: new Item('Forest Medallion', [0, 1]),
      water: new Item('Water Medallion', [0, 1]),
      fire: new Item('Fire Medallion', [0, 1]),
      spirit: new Item('Spirit Medallion', [0, 1]),
      shadow: new Item('Shadow Medallion', [0, 1]),
      kokiri: new Item('Kokiri Emerald', [0, 1]),
      goron: new Item('Goron Ruby', [0, 1]),
      zora: new Item('Zora Sapphire', [0, 1])
    }
    this.forestTemple = new KeyManager()
  }
}

class KeyManager {
  constructor (world, dungeon) {
    this.smallKeys = new Item('Small Key', [0, 1, 2, 3])
    this.bigKey = new Item('Big Key', [0, 1])
  }
}

class Item {
  constructor (name, values) {
    this.name = name
    /**
     * @type {Object[]}
     */
    this.values = values
    this.value = values[0]
  }

  Icon () {
    return `imgs/${this.name.replace(' ', '_').toLowerCase()}.png`
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
  Accessible (complete = false, showItems = false) {
    return this.Array().filter(location => (IsAccessible(location, this.world) && complete === false && !location.completed) || (complete && location.completed === true))
  }

  /**
   * Returns a list of all of the items that contains all of the keywords.
   * @param {String} term A full string containing keywords
   * @returns {Location[]}
   */
  Search (term) {
    const keywords = term.split(' ')
    return this.Accessible().filter((location) => {
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
  Get (completed = false) {
    return this.Array().filter(location => IsAccessible(location, this.local.world)).filter(location => location.completed === completed)
  }
}
