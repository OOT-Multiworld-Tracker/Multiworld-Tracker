import React from 'react'
import PropTypes from 'prop-types'

import './Toast.css'

export default class Toast extends React.Component {
  render () {
    return (
            <div className="toast">
                <div className="toast-message">
                    {this.props.text}
                </div>
            </div>
    )
  }
}

Toast.propTypes = {
  text: PropTypes.string.isRequired
}
