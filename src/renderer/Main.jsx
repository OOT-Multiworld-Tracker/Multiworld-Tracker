import React, { PureComponent } from 'react'
import './Main.css'
import SearchBar from './SearchBar'
import Locations from './Locations'

export default class Main extends PureComponent {
  constructor (props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.state = { search: '' }
  }

  handleSearch (term) {
    this.setState({ search: term })
  }

  render () {
    return (
      <div className='pane padded'>
        <div>
          <SearchBar onSearch={this.handleSearch} />
        </div><br />
        <Locations search={this.state.search} />
      </div>
    )
  }
}
