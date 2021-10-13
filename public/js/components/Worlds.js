import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Worlds extends React.Component {
  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>World</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          <List>
            {app.worlds.map((world, index) => {
              return (
                <ListItem key={index}>
                  <td>{world.save.player_name}</td>
                  <td>{world.items.length}</td>
                </ListItem>
              )
            })}
          </List>
        </tbody>
      </table>
    )
  }
}
