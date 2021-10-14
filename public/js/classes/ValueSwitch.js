/**
 * A switch that can be toggled between many preset values before looping back to the first value.
 */
export default class ValueSwitch {
  constructor (name, values) {
    /**
     * @type {String}
     */
    this.name = name

    /**
    * @type {Object[]}
    */
    this.values = values
    this.value = this.values[0]
  }

  Index () {
    return this.values.indexOf(this.value)
  }

  Set (index) {
    this.value = this.values[index]
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