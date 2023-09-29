import GameManager from './GameManager'
import ValueSwitch from './ValueSwitch'
import { existsSync, readFileSync } from 'fs'

export class Item extends ValueSwitch {
  constructor (id, name, value, category=null) {
    super(name, value)
    this.id = id
    this.category = category
  }

  Icon () {
    if (!existsSync(`${GameManager.GetGameDirectory()}\\${GameManager.GetSelectedGame().directory}\\icons\\${this.name.replace(/ /g, '_').toLowerCase()}${(this.Index() > 1 && typeof this.value === 'string') ? `_${this.Index()}` : ""}.png`)) return 'unknown';

    return readFileSync(`${GameManager.GetGameDirectory()}\\${GameManager.GetSelectedGame().directory}\\icons\\${this.name.replace(/ /g, '_').toLowerCase()}${(this.Index() > 1 && typeof this.value === 'string') ? `_${this.Index()}` : ""}.png`, 'base64')
  }
}

export class TradeItem extends Item {
  constructor (name) {
    super(name, [0])
    this.id = 1
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
  Icon () {
    return `/images/bottle.png`
  }

  constructor (name) {
    super(name, [0])
    this.id = 1
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
