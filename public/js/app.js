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
    this.slingShot = new Item('Slingshot', [0, 20, 30, 40])
    this.bow = new Item('Bow', [0, 30, 40, 50])
    this.arrows = {
      fire: new Item('Fire Arrows', [0, 1]),
      ice: new Item('Ice Arrows', [0, 1]),
      light: new Item('Light Arrows', [0, 1])
    }
    this.magic = {
      din: new Item('Din\'s Fire', [0, 1]),
      farore: new Item('Farores\'s Wind', [0, 1]),
      nayru: new Item('Nayru\'s Love', [0, 1])
    }
    this.ocarina = new Item('Ocarina', [0, 'Saria\'s Ocarina', 'Ocarina of Time'])
    this.hookshot = new Item('Hookshot', [0, 'Hookshot', 'Longshot'])
    this.lensOfTruth = new Item('Lens of Truth', [0, 1])
    this.boomerang = new Item('Boomerang', [0, 1])
    this.megatonHammer = new Item('Megaton Hammer', [0, 1])
    this.bottles = {
      bottle_1: new Item('Bottle 1', [0, 1]),
      bottle_2: new Item('Bottle 2', [0, 1]),
      bottle_3: new Item('Bottle 3', [0, 1]),
      bottle_4: new Item('Bottle 4', [0, 1])
    }
    this.childTradeItem = new Item('Child Trading', [0, 43])
    this.adultTradeItem = new Item('Adult Trading', [0, 43])
    this.wallet = new Item('Wallet', [0, 99, 200, 500, 999])
    this.swimming = new Item('Swimming', [0, 'Silver Scale', 'Gold Scale'])
    this.strength = new Item('Strength Upgrade', [0, 'Goron\'s Bracelet', 'Silver Gauntlet', 'Golden Gauntlet'])
    this.kokiriSword = new Item('Kokiri Sword', [0, 1])
    this.masterSword = new Item('Master Sword', [0, 1])
    this.biggoronSword = new Item('Biggoron Sword', [0, 1])
    this.goronTunic = new Item('Goron Tunic', [0, 1])
    this.zoraTunic = new Item('Zora Tunic', [0, 1])
    this.gerudoMembershipCard = new Item('Gerudo Membership Card', [0, 1])
    this.stoneOfAgony = new Item('Stone of Agony', [0, 1])
    this.goldSkulltulas = new Item('Gold Skulltulas', [0, 10, 20, 30, 40, 50])
    this.heartPieces = new Item('Heart Pieces', [0, 4, 8, 12, 16, 20, 24, 28, 32])
    this.songs = {
      zeldaLullaby: new Item('Zelda\'s Lullaby', [0, 1]),
      eponasSong: new Item('Epona\'s Song', [0, 1]),
      sunsSong: new Item('Sun\'s Song', [0, 1]),
      songOfTime: new Item('Song Of Time', [0, 1]),
      songOfStorms: new Item('Song Of Storms', [0, 1]),
      preludeOfLight: new Item('Prelude Of Light', [0, 1]),
      minuetOfForest: new Item('Minuet Of Forest', [0, 1]),
      boleroOfFire: new Item('Bolero Of Fire', [0, 1]),
      serenadeOfWater: new Item('Serenade Of Water', [0, 1]),
      nocturneOfShadow: new Item('Nocturne Of Shadow', [0, 1]),
      requiemOfSpirit: new Item('Requiem Of Spirit', [0, 1])
    }
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
        if (!location.name.toLowerCase().includes(keyword)) {
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
