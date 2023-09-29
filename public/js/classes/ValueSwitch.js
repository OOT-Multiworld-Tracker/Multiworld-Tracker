/**
 * A switch that can be toggled between many preset values before looping back to the first value.
 */
export default class ValueSwitch {
  constructor (name, values) {
    /**
     * @type {String}
     */
    this.name = name || console.error('ValueSwitch requires a name.')

    /**
    * @type {Object[]}
    */
    this.values = values || console.error('ValueSwitch requires values.')
    this.value = this.values[0]
  }

  Index () {
    return this.values.indexOf(this.value)
  }

  Set (index) {
    this.value = this.values[index]
  }

  Increase () {
    const index = this.values.indexOf(this.value)

    if (index + 1 <= this.values.length - 1) {
      this.value = this.values[index + 1]
    }
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

  /**
   * Go back through the values
   */
  Back () {
    const index = this.values.indexOf(this.value)

    if (index - 1 > 0) { this.value = this.values[index] }
  }
}
