import { App } from '../app'
import { ItemManager, LocationManager } from '../AppManagers'

const save = {
  entrance_index: 205,
  cutscene_number: 65523,
  world_time: 11112,
  world_night_flag: false,
  zeldaz_string: 'ZELDAZ',
  death_counter: 0,
  player_name: 'Loading...',
  dd_flag: false,
  heart_containers: 14,
  health: 224,
  magic_meter_size: 0,
  magic_current: 48,
  rupee_count: 150,
  navi_timer: 0,
  checksum: 0,
  age: 0,
  swords: {
    kokiriSword: false,
    masterSword: false,
    giantKnife: false,
    biggoronSword: false
  },
  shields: {
    dekuShield: false,
    hylianShield: false,
    mirrorShield: false
  },
  tunics: {
    kokiriTunic: false,
    goronTunic: false,
    zoraTunic: false
  },
  boots: {
    kokiriBoots: false,
    ironBoots: false,
    hoverBoots: false
  },
  inventory: {
    dekuSticks: false,
    dekuNuts: false,
    bombs: false,
    bombchus: false,
    magicBeans: false,
    fairySlingshot: false,
    fairyBow: false,
    fireArrows: false,
    iceArrows: false,
    lightArrows: false,
    dinsFire: false,
    faroresWind: false,
    nayrusLove: false,
    ocarina: 0,
    hookshot: 0,
    boomerang: false,
    lensOfTruth: false,
    megatonHammer: false,
    bottle_1: 0,
    bottle_2: 0,
    bottle_3: 0,
    bottle_4: 0,
    childTradeItem: 1,
    adultTradeItem: 1,
    wallet: 0,
    quiver: 0,
    bulletBag: 0,
    bombBag: 0,
    dekuNutsCapacity: 0,
    dekuSticksCapacity: 0,
    swimming: 0,
    strength: 0
  },
  questStatus: {
    gerudoMembershipCard: false,
    stoneOfAgony: false,
    displayGoldSkulltulas: false,
    goldSkulltulas: 0,
    heartPieces: 0,
    zeldasLullaby: false,
    eponasSong: false,
    sariasSong: false,
    sunsSong: false,
    songOfTime: false,
    songOfStorms: false,
    preludeOfLight: false,
    minuetOfForest: false,
    boleroOfFire: false,
    serenadeOfWater: false,
    nocturneOfShadow: false,
    requiemOfSpirit: false,
    lightMedallion: false,
    forestMedallion: false,
    waterMedallion: false,
    fireMedallion: false,
    spiritMedallion: false,
    shadowMedallion: false,
    kokiriEmerald: false,
    goronRuby: false,
    zoraSapphire: false
  },
  magic_beans_purchased: 1
}

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
    this.save = save

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
