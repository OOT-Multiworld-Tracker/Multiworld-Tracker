import React from 'react'
import { List, ListItem } from './Lists'

export default class Saves extends React.Component {
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
