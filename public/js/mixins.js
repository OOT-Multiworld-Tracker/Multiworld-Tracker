//Mixins
function CanStunDeku(world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.fairySlingshot || save.inventory.boomerang || save.inventory.dekuSticks || (save.inventory.bombBag || save.inventory.bombchus) || save.inventory.dekuNuts || save.inventory.dinsFire || save.swords.kokiriSword || save.shields.dekuShield
}

function HasExplosives(world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.bombBag || save.inventory.bombchus
}

function CanDamage (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.swords.kokiriSword || save.inventory.bombchus || save.inventory.bombBag || save.inventory.dekuSticks || (CanUseMagic() && save.inventory.dinsFire) || (save.age == 1 && save.inventory.fairySlingshot)
}

function CanExitForest (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  const locations = world.locations
  return settings.open_forest !== 'closed' || locations[0].completed || HasExplosives() || save.inventory.swimming >= 1 || (CanUseMagic() && save.inventory.dinsFire)
}

function CanLightFires (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.dekuSticks || (CanUseMagic() && save.inventory.dinsFire) || (save.age == 1 && CanUseMagic() && save.inventory.fairyBow && save.inventory.fireArrows)
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
  return CanEnterDeathMountain() && (save.inventory.strength >= 1 || HasExplosives());
}

function CanEnterDeathMountain(world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return settings.open_kakariko || (save.inventory.childTradeItem >= 2 || HasExplosives());
}

function CanEnterZorasRiver (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.swimming >= 1 || HasExplosives() || (CanBecomeAdult() && save.inventory.megatonHammer)
}

function CanEnterZorasDomain (world={save, settings, "locations":MapToArray(locations)}) {
  const save = world.save
  return save.inventory.swimming >= 1 || (HasExplosives() || (CanBecomeAdult() && save.inventory.megatonHammer) && (save.inventory.ocarina >= 1 && save.questStatus.sariasSong))
}

function CanEnterJabu (world={save, settings, "locations":MapToArray(locations)}) {
  return CanEnterZorasDomain()
}