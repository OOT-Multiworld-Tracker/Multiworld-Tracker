import ValueSwitch from './ValueSwitch'

export class Item extends ValueSwitch {
  Icon () {
    return `/images/${this.name.replace(' ', '_').toLowerCase()}.png`
  }
}

export class TradeItem extends Item {
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

export class Bottle extends Item {
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
