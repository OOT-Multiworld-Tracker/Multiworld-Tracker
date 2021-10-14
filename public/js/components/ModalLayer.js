import React from 'react'

export default class ModalLayer extends React.Component {
  constructor (props) {
    super(props)
    this.handleOutsideClick = this.props.onOutsideClick.bind(this)
  }

  render () {
    return (
      this.props.display === true
        ? (
          <div className='modal-layer' style={{ display: this.props.display ? 'flex' : 'none' }} onClick={this.handleOutsideClick}>
            {this.props.children}
          </div>
          )
        : null
    )
  }
}
