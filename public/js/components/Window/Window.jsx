import React, { Component } from 'react'
import Header from '../Header'
import PropTypes from 'prop-types'

export default class Window extends Component {
  render () {
    return (
        <div className="window" onClick={this.props.onClick}>
            <Header />

            <div className="window-content">
                <div className="pane-group">
                    {this.props.children}
                </div>
            </div>

        </div>
    )
  }
}

// Window props validation
Window.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}
