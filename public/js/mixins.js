//Mixins
function CanStunDeku(world = { save, settings, "locations":MapToArray(locations) }) {
  const save = world.save
  return save.inventory.fairySlingshot || save.inventory.boomerang || save.inventory.dekuSticks || (save.inventory.bombBag || save.inventory.bombchus) || save.inventory.dekuNuts || save.inventory.dinsFire || save.swords.kokiriSword || save.shields.dekuShield
}

function HasExplosives(world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.bombBag || save.inventory.bombchus
}

function CanDamage (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.swords.kokiriSword || save.inventory.bombchus || save.inventory.bombBag || save.inventory.dekuSticks || (CanUseMagic(world) && save.inventory.dinsFire) || (save.age == 1 && save.inventory.fairySlingshot)
}

function CanExitForest (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  const locations = world.locations
  return settings.open_forest !== 'closed' || locations[0].completed || HasExplosives(world) || save.inventory.swimming >= 1 || (CanUseMagic(world) && save.inventory.dinsFire)
}

function CanLightFires (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.dekuSticks || (CanUseMagic(world) && save.inventory.dinsFire) || (save.age == 1 && CanUseMagic(world) && save.inventory.fairyBow && save.inventory.fireArrows)
}

function CanUseMagic (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.magic_meter_size > 1
}

function CanBecomeAdult (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return settings.open_door_of_time || (save.inventory.ocarina >= 1 && save.questStatus.songOfTime)
}

// Area Entry Mixins
function CanEnterDodongo (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return CanEnterDeathMountain(world) && (save.inventory.strength >= 1 || HasExplosives(world));
}

function CanEnterDeathMountain(world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return settings.open_kakariko || (save.inventory.childTradeItem >= 2 || HasExplosives(world));
}

function CanEnterZorasRiver (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.swimming >= 1 || HasExplosives(world) || (CanBecomeAdult(world) && save.inventory.megatonHammer)
}

function CanEnterZorasDomain (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.swimming >= 1 || (HasExplosives(world) || (CanBecomeAdult(world) && save.inventory.megatonHammer) && (save.inventory.ocarina >= 1 && save.questStatus.sariasSong))
}

function CanEnterJabu (world={save, settings, "locations":MapToArray(locations)}) {
  return CanEnterZorasDomain(world)
}

function CanEnterForest (world={save, settings, "locations":MapToArray(locations)}) {
  return CanBecomeAdult(world) && save.inventory.hookshot >= 1 && save.inventory.ocarina >= 1 && save.questStatus.sariasSong
}

function CanEnterFire (world = {save, settings, "locations": MapToArray(locations) }) {
  return CanBecomeAdult(world) && CanEnterDMC(world) && save.inventory.hookshot >= 1
}

function CanEnterDMC (world = {save, settings, "locations": MapToArray(locations) }) {
  return HasExplosives(world)
}

function CanEnterWater (world = {save, settings, "locations": MapToArray(locations) }) {
  return CanBecomeAdult(world) && save.boots.ironBoots && save.inventory.hookshot >= 1
}