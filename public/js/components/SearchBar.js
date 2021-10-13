import React from 'react'

export default class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onChange(e)
  }

  render () {
    return (
      <input type='text' className='form-control search-bar' onChange={this.handleChange} placeholder='Search...' />
    )
  }
}
