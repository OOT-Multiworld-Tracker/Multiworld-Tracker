import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './ButtonGroup.css'

export default class ButtonGroup extends PureComponent {
  constructor (props) {
    super(props)

    /**
     * Create the styling/theming tree
     */
    this.className = [
      props.fullWidth ? 'btn-group-full-width' : 'btn-group'
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

ButtonGroup.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
  fullWidth: PropTypes.bool
}
