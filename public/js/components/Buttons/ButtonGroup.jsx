import React, { PureComponent } from 'react'

import './ButtonGroup.css'

export default class ButtonGroup extends PureComponent {
  constructor (props) {
    super(props)

    /**
     * Create the styling/theming tree
     */
    this.className = [
      'btn-group'
    ]

    if (this.props.align) this.className.push('pull-' + this.props.align)
  }

  render () {
    return (
      <div
        className={this.className.join(' ')}
      >
        {this.props.children}
      </div>
    )
  }
}
