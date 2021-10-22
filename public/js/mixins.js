// Mixins
function CanStunDeku (world) {
  return world.items.fairySlingshot.Index() > 0 || world.items.boomerang.Index() > 0 || world.items.dekuSticks.Index() > 0 || (world.items.bombs.Index() > 0 || world.items.bombchus.Index() > 0) || world.items.dekuNuts.Index() > 0 || world.items.dinsFire.Index() > 0 || world.items.kokiriSword.Index() > 0 || world.items.dekuShield.Index() > 0
}

function HasExplosives (world) {
  return world.items.bombs.value > 0 || world.items.bombchus.value > 0
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
  return world.app.global.settings.openDoorOfTime.value == true || (world.items.ocarina.Index() >= 1 && world.save.questStatus.songOfTime > 0)
}

// Area Entry Mixins
function CanEnterDodongo (world) {
  return CanEnterDeathMountain(world) && (world.items.strength.Index() >= 1 || HasExplosives(world))
}

function CanEnterDeathMountain (world) {
  return world.app.global.settings.open_kakariko || (world.items.childTradeItem.value >= 34 || HasExplosives(world))
}

function CanEnterZorasRiver (world) {
  return world.items.swimming.Index() >= 1 || HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0)
}

function CanEnterZorasDomain (world) {
  return world.items.swimming.Index() >= 1 || (HasExplosives(world) || (CanBecomeAdult(world) && world.items.megatonHammer.Index() > 0) && (world.items.ocarina.Index() >= 1 && world.save.questStatus.sariasSong.Index() > 0))
}

function CanEnterJabu (world) {
  return CanEnterZorasDomain(world)
}

function CanEnterForest (world) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && (world.items.ocarina.Index() >= 1 && (world.items.sariasSong.value > 0 || world.items.minuetOfForest.value > 0))
}

function CanEnterFire (world) {
  return CanBecomeAdult(world) && CanEnterDMC(world) && world.items.hookshot.Index() >= 1
}

function CanEnterIce (world) {
  return CanBecomeAdult(world) && CanEnterWater(world)
}

function CanEnterDMC (world) {
  return HasExplosives(world)
}

function CanEnterWater (world) {
  return CanBecomeAdult(world) && world.save.boots.ironBoots && world.items.hookshot >= 1
}

function CanEnterShadow (world) {
  return CanBecomeAdult(world) && world.items.hookshot.Index() >= 1 && (world.items.ocarina.Index() >= 1 && world.save.questStatus.nocturneOfShadow > 0) && world.items.lensOfTruth.Index() > 0
}

function CanEnterSpirit (world) {
  return (world.items.ocarina.Index() >= 1 && world.save.questStatus.requiemOfSpirit > 0) || (CanBecomeAdult(world) && world.save.questStatus.gerudoMembershipCard > 0 && (world.items.hookshot.Index() == 2 || world.items.ocarina.Index() >= 1 && world.save.questStatus.eponasSong > 0))
}

function CanEnterGtG (world) {
  return (CanBecomeAdult(world) && world.items.gerudoMembershipCard > 0 && (world.items.hookshot.Index() === 2 || (world.items.ocarina.Index() >= 1 && world.items.eponasSong.Index()) > 0))
}

function CanEnterGC (world) {
  return (CanBecomeAdult(world) && world.save.questStatus.lightMedallion > 0 && world.save.questStatus.spiritMedallion > 0 && world.save.questStatus.shadowMedallion > 0)
}

function ShopRandomized (world, count = 0) {
  return world.app.global.settings.shopSanity.value >= count
}

function IsScrubSanity (world) {
  return world.app.global.settings.shuffleScrubs.value !== 'none'
}

function IsTokenSanity (world) {
  return world.app.global.settings.tokenSanity.value !== 'vanilla'
}