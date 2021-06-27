import React, { PureComponent } from 'react'
import './Searchbar.css'

export default class Searchbar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { search: '' }
    this.search = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onSearch(e.target.value)
  }

  render () {
    return (
      <input className='btn btn-default search' onChange={this.handleChange} placeholder='Click Here to Search' />
    )
  }
}
