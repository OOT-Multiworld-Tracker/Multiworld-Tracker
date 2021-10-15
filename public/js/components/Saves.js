import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Saves extends React.Component {
  constructor () {
    super()
    app.on('saved', () => {
      this.forceUpdate()
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
