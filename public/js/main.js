const locations = new Map()
let locationJson = []

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
const dungeons = [{ name: 'Deku Tree', mq: false }, { name: "Dodongo's Cave", mq: false }, { name: 'Bottom of the Well', mq: false }, { name: "Jabu Jabu's Belly", mq: false }, { name: 'Forest Temple', mq: false }, { name: 'Fire Temple', mq: false }, { name: 'Water Temple', mq: false }, { name: 'Shadow Temple', mq: false }, { name: 'Spirit Temple', mq: false }, { name: 'Ice Cavern', mq: false }, { name: 'GTG', mq: false }, { name: "Ganon's Castle", mq: false }]
let settings = {
  open_forest: 'closed',
  open_kakariko: 'closed',
  open_door_of_time: false,
  zora_fountain: 'closed',
  gerudo_fortress: 'fast',
  bridge: 'stones',
  bridge_stones: 3,
  triforce_hunt: false,
  logic_rules: 'glitchless',
  bombchus_in_logic: true,
  skip_child_zelda: false,
  no_escape_sequence: true,
  no_guard_stealth: true,
  no_epona_race: true,
  skip_some_minigame_phases: true,
  shuffle_kokiri_sword: true,
  shuffle_ocarinas: true,
  shuffle_weird_egg: false,
  shuffle_gerudo_card: true,
  shuffle_song_items: 'song',
  shuffle_cows: false,
  shuffle_beans: true,
  shuffle_medigoron_carpet_salesman: true,
  owl_drops: false,
  spawn_positions: false,
  shuffle_scrubs: 'low',
  shopsanity: 2,
  tokensanity: 'dungeons'
}

let uploadedSpoiler

const app = new App()
const myWorld = 1

function SaveAlert () {
  SaveState(`${save.player_name}-${save.seed}`)
}

function SaveState (fileName) {
  const saveFile = {}
  Object.assign(saveFile, { dungeons: app.local.world.dungeons })
  Object.assign(saveFile, { settings: app.global.settings })
  Object.assign(saveFile, { save: app.local.world.save })
  Object.assign(saveFile, { locations: app.local.world.locations.Array() })

  localStorage.setItem(`save-${fileName}`, JSON.stringify(saveFile))
}

function LoadState (fileName) {
  const file = JSON.parse(localStorage.getItem(fileName))
  app.local.world.dungeons = file.dungeons
  app.global.settings = file.settings
  app.local.world.save = file.save

  file.locations.forEach((location) => {
    app.local.world.locations.All().set(location.id, location)
  })

  ReactDOM.render(<Sidebar />, document.getElementsByClassName('sidebar')[0])
  app.RenderLocations()
}

function SpoilerUploaded (data) {
  $.getJSON(URL.createObjectURL(data.files[0]), (data) => {
    ParseSpoilerLog(data)
  })

  sidebarButtons.setState({ uploaded: true })
}

function MapToArray (map) {
  const array = []
  map.forEach((value) => array.push(value))
  return array
}

function ParseSpoilerLog (log) {
  console.log(log)
  settings = log.settings
  uploadedSpoiler = log
  save.seed = log[':seed']
  app.worlds = []

  if (settings.world_count > 1) {
    Object.values(log.locations).forEach((world, index) => {
      app.worlds.push(new GameWorld(save, dungeons, Object.values(log.locations[`World ${index + 1}`])))
    })

    for (let i = 0; i < Object.keys(log.dungeons['World 1']).length; i++) {
      app.local.world.dungeons[i].mq = log.dungeons['World 1'][Object.keys(log.dungeons['World 1'])[i]] === 'mq'
    }
  } else {
    app.worlds.push(new GameWorld(save, dungeons, log.locations ))

    for (let i = 0; i < Object.keys(log.dungeons).length; i++) {
      app.local.world.dungeons[i].mq = log.dungeons[Object.keys(log.dungeons)[i]] === 'mq'
    }
  }

  ReactDOM.render(<Sidebar />, document.getElementsByClassName('sidebar')[0])
}

function ParseLocations (locations, spoiler = null) {
  $.getJSON('/json/locations.json', (data) => {
    locationJson = data
    data.forEach((location, index) => {
      location.id = index

      if (location.logic) { location.logic = eval(location.logic) }

      if (spoiler) { location.item = spoiler[index] }
      locations.set(location.id, location)
    })

    app.RenderLocations()
  })

  return locations
}

function IsAccessible (location, world) {
  return (location && (location.preExit == true || CanExitForest()) && (!location.logic || location.logic(world) && !location.completed))
}

function ToggleCompleted (props) {
  app.local.world.locations.Array()[props.id].completed = !app.local.world.locations.Array()[props.id].completed
  // Serialize and compress a packet for sending
  if (window.isElectron) { require('electron').ipcRenderer.send('packets', JSON.stringify({ world: myWorld - 1, save: { swords: save.swords, shields: save.shields, inventory: world.items, questStatus: save.questStatus }, locations: NetworkSerialize(app.local.world.locations.Array(), 'completed') }).replace(/true/g, '1').replace(/false/g, '0')) }
  app.RenderLocations()
}

// Mixins
function CanStunDeku (world = app.worlds[0]) {
  return world.items.fairySlingshot.Index() > 0 || world.items.boomerang.Index() > 0 || world.items.dekuSticks.Index() > 0 || (world.items.bombBag.Index() > 0 || world.items.bombchus.Index() > 0) || world.items.dekuNuts.Index() > 0 || world.items.dinsFire.Index() > 0 || world.items.kokiriSword.Index() > 0 || world.items.dekuShield.Index() > 0
}

function HasExplosives (world = app.worlds[0]) {
  return world.items.bombs.value > 0 || world.items.bombchus.value > 0
}

function CanDamage (world = app.worlds[0]) {
  return world.items.kokiriSword.Index() > 0 || world.items.bombchus.Index() > 0 || world.items.bombBag.Index() > 0 || world.items.dekuSticks.Index() > 0 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0) || (save.age == 1 && world.items.fairySlingshot.Index() > 0)
}

function CanExitForest (world = app.worlds[0]) {
  return settings.open_forest !== 'closed' || world.locations.Array()[0].completed || HasExplosives(world) || world.items.swimming.Index() >= 1 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0)
}

function CanLightFires (world = app.worlds[0]) {
  return world.items.dekuSticks.Index() > 0 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0) || (save.age == 1 && CanUseMagic(world) && world.items.fairyBow.Index() > 0 && world.items.fireArrows.Index() > 0)
}

function CanUseMagic (world = app.worlds[0]) {
  return world.save.magic_meter_size > 1
}

function CanBecomeAdult (world = app.worlds[0]) {
  const save = world.save
  return settings.open_door_of_time || (world.items.ocarina.Index() >= 1 && save.questStatus.songOfTime.Index() > 0)
}

// Area Entry Mixins
function CanEnterDodongo (world = app.worlds[0]) {
  return CanEnterDeathMountain(world) && (world.items.strength.Index() >= 1 || HasExplosives(world))
}

function CanEnterDeathMountain (world = app.worlds[0]) {
  return settings.open_kakariko || (world.items.childTradeItem.Index() >= 2 || HasExplosives(world))
}

function CanEnterZorasRiver (world = app.worlds[0]) {
  return world.items.swimming.Index() >= 1 || HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0)
}

function CanEnterZorasDomain (world = app.worlds[0]) {
  return world.items.swimming.Index() >= 1 || (HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0) && (world.items.ocarina.Index() >= 1 && save.questStatus.sariasSong.Index() > 0))
}

function CanEnterJabu (world = app.worlds[0]) {
  return CanEnterZorasDomain(world)
}

function CanEnterForest (world = app.worlds[0]) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && world.items.ocarina.Index() >= 1 && save.questStatus.sariasSong.Index() > 0
}

function CanEnterFire (world = app.worlds[0]) {
  return CanBecomeAdult(world) && CanEnterDMC(world) && world.items.hookshot.Index() >= 1
}

function CanEnterIce (world = app.worlds[0]) {
  return CanBecomeAdult(world) && CanEnterWater(world)
}

function CanEnterDMC (world = app.worlds[0]) {
  return HasExplosives(world)
}

function CanEnterWater (world = app.worlds[0]) {
  const save = world.save
  return CanBecomeAdult(world) && save.boots.ironBoots && world.items.hookshot >= 1
}

function CanEnterShadow (world = app.worlds[0]) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && (world.items.ocarina.Index() >= 1 && save.questStatus.nocturneOfShadow.Index() > 0) && world.items.lensOfTruth.Index() > 0
}

function CanEnterSpirit (world = app.worlds[0]) {
  return (world.items.ocarina.Index() >= 1 && save.questStatus.requiemOfSpirit.Index() > 0) || (CanBecomeAdult() && save.questStatus.gerudoMembershipCard.Index() > 0 && (world.items.hookshot.Index() == 2 || world.items.ocarina.Index() >= 1 && save.questStatus.eponasSong.Index() > 0))
}

function CanEnterGtG (world = app.worlds[0]) {
  return (CanBecomeAdult() && save.questStatus.gerudoMembershipCard.Index() > 0 && (world.items.hookshot.Index() == 2 || world.items.ocarina.Index() >= 1 && save.questStatus.eponasSong.Index() > 0))
}

function CanEnterGC (world = app.worlds[0]) {
  return (CanBecomeAdult() && save.questStatus.lightMedallion.Index() > 0 && save.questStatus.spiritMedallion.Index() > 0 && save.questStatus.shadowMedallion.Index() > 0)
}

function ShopRandomized (world = app.local.world, count = 0) {
  return app.global.settings.shopsanity >= count
}

function IsScrubSanity (world = app.local.world) {
  return app.global.settings.shuffle_scrubs !== 'none'
}
