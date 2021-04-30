const locations = new Map()
let locationJson = []

let save = { entrance_index: 205, cutscene_number: 65523, world_time: 11112, world_night_flag: true, zeldaz_string: 'ZELDAZ', death_counter: 0, player_name: 'Loading...     ', dd_flag: false, heart_containers: 14, health: 224, magic_meter_size: 0, magic_current: 48, rupee_count: 150, navi_timer: 0, checksum: 0, age: 0, swords: { kokiriSword: true, masterSword: true, giantKnife: true, biggoronSword: false }, shields: { dekuShield: true, hylianShield: true, mirrorShield: true }, tunics: { kokiriTunic: true, goronTunic: true, zoraTunic: true }, boots: { kokiriBoots: true, ironBoots: true, hoverBoots: true }, inventory: { dekuSticks: true, dekuNuts: true, bombs: true, bombchus: true, magicBeans: true, fairySlingshot: true, fairyBow: true, fireArrows: true, iceArrows: true, lightArrows: true, dinsFire: true, faroresWind: true, nayrusLove: true, ocarina: 1, hookshot: 1, boomerang: true, lensOfTruth: true, megatonHammer: true, bottle_1: 20, bottle_2: 21, bottle_3: 22, bottle_4: 23, childTradeItem: 33, adultTradeItem: 45, wallet: 1, quiver: 1, bulletBag: 1, bombBag: 1, dekuNutsCapacity: 1, dekuSticksCapacity: 1, swimming: 1, strength: 1 }, questStatus: { gerudoMembershipCard: true, stoneOfAgony: true, displayGoldSkulltulas: true, goldSkulltulas: 0, heartPieces: 0.0625, zeldasLullaby: true, eponasSong: true, sariasSong: true, sunsSong: true, songOfTime: true, songOfStorms: true, preludeOfLight: true, minuetOfForest: true, boleroOfFire: true, serenadeOfWater: true, nocturneOfShadow: true, requiemOfSpirit: true, lightMedallion: true, forestMedallion: true, waterMedallion: true, fireMedallion: true, spiritMedallion: true, shadowMedallion: true, kokiriEmerald: false, goronRuby: false, zoraSapphire: false }, magic_beans_purchased: 1 }
let dungeons = [{ name: 'Deku Tree', mq: false }, { name: "Dodongo's Cave", mq: false }, { name: 'Bottom of the Well', mq: false }, { name: "Jabu Jabu's Belly", mq: false }, { name: 'Forest Temple', mq: false }, { name: 'Fire Temple', mq: false }, { name: 'Water Temple', mq: false }, { name: 'Shadow Temple', mq: false }, { name: 'Spirit Temple', mq: false }, { name: 'Ice Cavern', mq: false }, { name: 'GTG', mq: false }, { name: "Ganon's Castle", mq: false }]
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

var app = new App()
var myWorld = 1

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

  ReactDOM.render(<Sidebar/>, document.getElementsByClassName('sidebar')[0])
  ReactDOM.render(<Locations/>, document.getElementById('avaliable-root'))
}

function SpoilerUploaded (data) {
  $.getJSON(URL.createObjectURL(data.files[0]), (data) => {
    ParseSpoilerLog(data)
  })
}

function MapToArray (map) {
  const array = []
  map.forEach((value) => array.push(value))
  return array
}

function ParseSpoilerLog (log) {
  console.log(log)
  settings = log.settings
  save.seed = log[":seed"]
  app.worlds = []

  if (settings.world_count > 1) {
    Object.values(log.locations).forEach((world) => {
      app.worlds.push({ save, locations: world })
    })

    for (let i = 0; i < Object.keys(log.dungeons['World 1']).length; i++) {
      app.local.world.dungeons[i].mq = log.dungeons['World 1'][Object.keys(log.dungeons['World 1'])[i]] === 'mq'
    }
  } else {
    app.worlds.push({ save, locations: log.locations })

    for (let i = 0; i < Object.keys(log.dungeons).length; i++) {
      app.local.world.dungeons[i].mq = log.dungeons[Object.keys(log.dungeons)[i]] === 'mq'
    }
  }

  ReactDOM.render(<Sidebar/>, document.getElementsByClassName('sidebar')[0])
}

function ParseLocations (locations) {
  $.getJSON('/json/locations.json', (data) => {
    locationJson = data
    data.forEach((location, index) => {
      location.id = index

      if (location.logic) {
        location.logic = eval(location.logic)
      }

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
  if (window.isElectron)
    require('electron').ipcRenderer.send('packets', JSON.stringify({ save: { swords: save.swords, shields: save.shields, inventory: save.inventory, questStatus: save.questStatus }, locations: NetworkSerialize(locations, 'completed') }).replace(/true/g, '1').replace(/false/g, '0'))
  app.RenderLocations()
}

// Mixins
function CanStunDeku (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.inventory.fairySlingshot || save.inventory.boomerang || save.inventory.dekuSticks || (save.inventory.bombBag || save.inventory.bombchus) || save.inventory.dekuNuts || save.inventory.dinsFire || save.swords.kokiriSword || save.shields.dekuShield
}

function HasExplosives (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.inventory.bombBag || save.inventory.bombchus
}

function CanDamage (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.swords.kokiriSword || save.inventory.bombchus || save.inventory.bombBag || save.inventory.dekuSticks || (CanUseMagic(world) && save.inventory.dinsFire) || (save.age == 1 && save.inventory.fairySlingshot)
}

function CanExitForest (world = app.local.world) {
  const save = world.save
  const locations = world.locations
  return settings.open_forest !== 'closed' || world.locations.Array()[0].completed || HasExplosives(world) || save.inventory.swimming >= 1 || (CanUseMagic(world) && save.inventory.dinsFire)
}

function CanLightFires (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.inventory.dekuSticks || (CanUseMagic(world) && save.inventory.dinsFire) || (save.age == 1 && CanUseMagic(world) && save.inventory.fairyBow && save.inventory.fireArrows)
}

function CanUseMagic (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.magic_meter_size > 1
}

function CanBecomeAdult (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return settings.open_door_of_time || (save.inventory.ocarina >= 1 && save.questStatus.songOfTime)
}

// Area Entry Mixins
function CanEnterDodongo (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanEnterDeathMountain(world) && (save.inventory.strength >= 1 || HasExplosives(world))
}

function CanEnterDeathMountain (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return settings.open_kakariko || (save.inventory.childTradeItem >= 2 || HasExplosives(world))
}

function CanEnterZorasRiver (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.inventory.swimming >= 1 || HasExplosives(world) || (CanBecomeAdult(world) && save.inventory.megatonHammer)
}

function CanEnterZorasDomain (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return save.inventory.swimming >= 1 || (HasExplosives(world) || (CanBecomeAdult(world) && save.inventory.megatonHammer) && (save.inventory.ocarina >= 1 && save.questStatus.sariasSong))
}

function CanEnterJabu (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanEnterZorasDomain(world)
}

function CanEnterForest (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanBecomeAdult(world) && save.inventory.hookshot >= 1 && save.inventory.ocarina >= 1 && save.questStatus.sariasSong
}

function CanEnterFire (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanBecomeAdult(world) && CanEnterDMC(world) && save.inventory.hookshot >= 1
}

function CanEnterIce (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanBecomeAdult(world) && CanEnterWater(world)
}

function CanEnterDMC (world = { save, settings, locations: MapToArray(locations) }) {
  return HasExplosives(world)
}

function CanEnterWater (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanBecomeAdult(world) && save.boots.ironBoots && save.inventory.hookshot >= 1
}

function CanEnterShadow (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return CanBecomeAdult(world) && save.inventory.hookshot >= 1 && (save.inventory.ocarina>=1&&save.questStatus.nocturneOfShadow) && save.inventory.lensOfTruth
}

function CanEnterSpirit (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return (save.inventory.ocarina>=1&&save.questStatus.requiemOfSpirit) || (CanBecomeAdult() && save.questStatus.gerudoMembershipCard && (save.inventory.hookshot == 2 || save.inventory.ocarina >= 1 && save.questStatus.eponasSong))
}

function CanEnterGtG (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return (CanBecomeAdult() && save.questStatus.gerudoMembershipCard && (save.inventory.hookshot == 2 || save.inventory.ocarina >= 1 && save.questStatus.eponasSong))
}

function CanEnterGC (world = { save, settings, locations: MapToArray(locations) }) {
  const save = world.save
  return (CanBecomeAdult() && save.questStatus.lightMedallion && save.questStatus.spiritMedallion && save.questStatus.shadowMedallion)
}