import React from 'react'
import PropTypes from 'prop-types'

export default class Modal extends React.Component {
  render () {
    return (
      <div className='modal' onClick={this.props.onClick}>
        <div className='modal-header'>{this.props.title}</div>
        <div className='modal-content'>{this.props.content}</div>
        {this.props.footer ? <div className='modal-footer'>{this.props.footer}</div> : null}
      </div>
    )
  }
}

// prop validations
Modal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  footer: PropTypes.string,
  onClick: PropTypes.func
}
