import React, { PureComponent } from 'react'
import './Locations.css'

export default class Locations extends PureComponent {
  constructor (props) {
    super(props)
    this.handleSearch = this.handleClick.bind(this)
    this.state = { search: '' }
  }

  handleClick (term) {
    this.setState({ search: term })
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <p>Test</p>
        </tbody>
      </table>
    )
  }
}
