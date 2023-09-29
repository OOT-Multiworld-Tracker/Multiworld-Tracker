import React from 'react'
import PropTypes from 'prop-types'
import app, { SaveUtils } from '../app'
import { List, ListItem } from './Lists'

export default class Saves extends React.PureComponent {
  constructor () {
    super()

    this.state = { saves: SaveUtils.GetFiles() }
    this.onSave = this.onSave.bind(this)
  }

  onSave () {
    this.setState({ saves: SaveUtils.GetFiles() })
  }

  componentDidMount () {
    app.saveLoad.subscribe('save', this.onSave)
  }

  componentWillUnmount () {
    app.saveLoad.unsubscribe('save', this.onSave)
  }

  list () {
    return JSON.parse(localStorage.saves).map((save, i) => (
    <ListItem key={i} onClick={(e) => { this.props.onSaveClick(e, save.name) }}>
    {save.name}
    </ListItem>))
  }

  render () {
    return (
      <List>
        {this.list()}
      </List>
    )
  }
}

Saves.propTypes = {
  onSaveClick: PropTypes.func
}
