import React from 'react'
import PropTypes from 'prop-types'

export class List extends React.Component {
  render () {
    return (
      <div className='list'>
        {this.props.children}
      </div>
    )
  }
}

List.propTypes = {
  children: PropTypes.node
}

export class ListItem extends React.Component {
  render () {
    return (
      <div onClick={this.props.onClick} onContextMenu={this.props.onContextMenu} className={this.props.type === 'header' ? 'list-header' : 'list-item'}>
        {this.props.children}
      </div>
    )
  }
}

ListItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  type: PropTypes.string
}
