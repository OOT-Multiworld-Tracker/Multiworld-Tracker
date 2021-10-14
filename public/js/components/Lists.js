import React from 'react'

export class List extends React.Component {
  render () {
    return (
      <div className='list'>
        {this.props.children}
      </div>
    )
  }
}

export class ListItem extends React.Component {
  render () {
    return (
      <div onClick={this.props.onClick} onContextMenu={this.props.onContextMenu} className='list-item'>
        {this.props.children}
      </div>
    )
  }
}
