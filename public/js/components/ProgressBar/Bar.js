import React from 'react'
import PropTypes from 'prop-types'

export default class Bar extends React.Component {
  render () {
    return (
        <div className='progress' style={{ width: this.props.length + '%' }}>
            <div className='progress-bar' style={{ width: this.props.fill + '%' }} />
        </div>
    )
  }
}

Bar.propTypes = {
  length: PropTypes.number,
  fill: PropTypes.number
}
