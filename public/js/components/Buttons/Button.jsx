import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './Button.css'

export default class Button extends PureComponent {
  constructor (props) {
    super(props)

    /**
     * Create the styling/theming tree
     */
    this.className = [
      'btn',
      'btn-default'
    ]

    if (this.props.align) this.className.push('pull-' + this.props.align)
    if (this.props.theme) this.className.push('btn-' + this.props.theme)
  }

  render () {
    return (
      <button
        className={this.className.join(' ')}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    )
  }
}

Button.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'])
}
