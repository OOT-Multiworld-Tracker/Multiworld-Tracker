// Mixins
function CanStunDeku (world) {
  return world.items.fairySlingshot.Index() > 0 || world.items.boomerang.Index() > 0 || world.items.dekuSticks.Index() > 0 || (world.items.bombs.Index() > 0 || world.items.bombchus.Index() > 0) || world.items.dekuNuts.Index() > 0 || world.items.dinsFire.Index() > 0 || world.items.kokiriSword.Index() > 0 || world.items.dekuShield.Index() > 0
}

function HasExplosives (world) {
  return world.items.bombs.value > 0 || (world.app.global.settings.bombchusInLogic.Index() > 0 && world.items.bombchus.value > 0)
}

function CanDamage (world) {
  return world.items.kokiriSword.Index() > 0 || world.items.bombchus.Index() > 0 || world.items.bombs.Index() > 0 || world.items.dekuSticks.Index() > 0 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0) || (world.save.age == 1 && world.items.fairySlingshot.Index() > 0)
}

function CanExitForest (world) {
  return world.app.global.settings.openForest.value !== 'closed' || world.locations.Array()[0].completed || HasExplosives(world) || world.items.swimming.Index() >= 1 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0)
}

function CanLightFires (world) {
  return world.items.dekuSticks.Index() > 0 || (CanUseMagic(world) && world.items.dinsFire.Index() > 0) || (world.save.age == 1 && CanUseMagic(world) && world.items.fairyBow.Index() > 0 && world.items.fireArrows.Index() > 0)
}

function CanUseMagic (world) {
  return world.save.magic_meter_size > 1
}

function CanBecomeAdult (world) {
  return (world.app.global.settings.openDoorOfTime.value == true || (world.items.ocarina.Index() >= 1 && world.items.songOfTime > 0))
}

const entranceLogics = [
  Deku,
  Dodongo,
  BOTW,
  Jabu,
  Forest,
  Fire,
  Water,
  Shadow,
  Spirit,
  Ice,
  GtG,
  GC
]

function GetDungeonLogic (world, dungeon) {
  let dung = world.dungeons.indexOf(world.dungeons.find((dun) => { return dun.random == dungeon }))
  if (dung == -1) dung = dungeon;
  return entranceLogics[dung](world)
}

// Area Entry Mixins
function CanEnterDodongo (world) {
  return GetDungeonLogic(world, 1)
}

function CanEnterJabu (world) {
  return GetDungeonLogic(world, 3)
}

function CanEnterForest (world) {
  return GetDungeonLogic(world, 4)
}

function CanEnterFire (world) {
  return GetDungeonLogic(world, 5)
}

function CanEnterIce (world) {
  return GetDungeonLogic(world, 9)
}

function CanEnterWater (world) {
  return GetDungeonLogic(world, 6)
}

function CanEnterShadow (world) {
  return GetDungeonLogic(world, 7)
}

function CanEnterSpirit (world) {
  return GetDungeonLogic(world, 8)
}

function CanEnterGtG (world) {
  return GetDungeonLogic(world, 10)
}

function CanEnterGC (world) {
  return GetDungeonLogic(world, 11)
}


// Area Entry Mixins
function Dodongo (world) {
  return CanEnterDeathMountain(world) && (world.items.strength.Index() >= 1 || HasExplosives(world))
}

function Deku (world) {
  return world.items.kokiriSword.Index() > 0 && world.items.dekuShield.Index() > 0;
}

function BOTW (world) {
  return world.items.songOfStorms.Index() > 0;
}

function CanEnterDeathMountain (world) {
  return world.app.global.settings.open_kakariko || (world.items.childTradeItem.value >= 34 || HasExplosives(world))
}

function CanEnterZorasRiver (world) {
  return world.items.swimming.Index() >= 1 || HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0)
}

function CanEnterZorasDomain (world) {
  return world.items.swimming.Index() >= 1 || (HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0) && (world.items.ocarina.Index() >= 1 && world.items.sariasSong.Index() > 0))
}

function Jabu (world) {
  return CanEnterZorasDomain(world)
}

function Forest (world) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && (world.items.ocarina.Index() >= 1 && (world.items.sariasSong.value > 0 || world.items.minuetOfForest.value > 0))
}

function Fire (world) {
  return CanBecomeAdult(world) && CanEnterDMC(world) && world.items.hookshot.Index() >= 1
}

function Ice (world) {
  return CanBecomeAdult(world) && Water(world)
}

function CanEnterDMC (world) {
  return HasExplosives(world)
}

function Water (world) {
  return CanBecomeAdult(world) && world.items.ironBoots.Index() > 0 && world.items.hookshot.Index() >= 1
}

function Shadow (world) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && (world.items.ocarina.Index() >= 1 && world.items.nocturneOfShadow > 0) && world.items.lensOfTruth.Index() > 0
}

function Spirit (world) {
  return (world.items.ocarina.Index() >= 1 && world.items.requiemOfSpirit.Index() > 0) || (CanBecomeAdult(world) && world.items.gerudoMembershipCard.Index() > 0 && (world.items.hookshot.Index() == 2 || world.items.ocarina.Index() >= 1 && world.items.eponasSong.Index() > 0))
}

function GtG (world) {
  return (CanBecomeAdult(world) && world.items.gerudoMembershipCard.Index() > 0 && (world.items.hookshot.Index() === 2 || (world.items.ocarina.Index() >= 1 && world.items.eponasSong.Index()) > 0))
}

function GC (world) {
  return (CanBecomeAdult(world) && world.items.lightMedallion.Index() > 0 && world.items.spiritMedallion.Index() > 0 && world.items.shadowMedallion.Index() > 0)
}

function ShopRandomized (world, count = 0) {
  return world.app.global.settings.shopSanity.value >= count
}

function IsScrubSanity (world) {
  return world.app.global.settings.shuffleScrubs.Index() > 0
}

function IsTokenSanity (world) {
  return world.app.global.settings.tokenSanity.Index() > 0
}