import React from 'react'
import app, { SaveUtils } from '../app'
import { List, ListItem } from './Lists'

export default class Saves extends React.PureComponent {
  constructor () {
    super()

    this.state = { saves: SaveUtils.GetFiles() }

    app.on('saved', () => {
      this.setState({ saves: SaveUtils.GetFiles() })
    })
  }

  list () {
    const files = []
    for (let i = 0; i < localStorage.length; i++) {
      files.push(
        <ListItem onClick={(e) => { this.props.onSaveClick(e, localStorage.key(i)) }}>
          {localStorage.key(i)}
        </ListItem>
      )
    }
    return files
  }

  render () {
    return (
      <List>
        {this.list()}
      </List>
    )
  }
}