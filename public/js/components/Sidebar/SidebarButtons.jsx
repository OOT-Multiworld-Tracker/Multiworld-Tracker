import React from 'react'
import app from '../../app'
import PropTypes from 'prop-types'

export default class SidebarButtons extends React.Component {
  constructor () {
    super()
    this.state = { status: false }

    this.connection = this.connection.bind(this)
    app.subscribeToClientConnection(this.connection)
  }

  connection (status) {
    this.setState({ status })
  }

  render () {
    return (
      <select className='form-control' onChange={this.props.onChange}>
        <option value='0'>World</option>
        <option value='3'>Items</option>
        <option value='1'>Saves</option>
        <option value='4'>Settings</option>
      </select>
    )
  }
}

SidebarButtons.propTypes = {
  onChange: PropTypes.func.isRequired
}
