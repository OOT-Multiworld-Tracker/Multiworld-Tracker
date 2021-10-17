import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Dungeons extends React.Component {
  constructor () {
    super()
    this.app = this.context
    this.state = { dungeons: app.local.world.dungeons }
  }

  render () {
    return (
      <List>
        {app.local.world.dungeons.map((dungeon) => {
          return (
            <ListItem key={dungeon.name} onClick={() => { dungeon.mq = !dungeon.mq; this.setState({ dungeons: app.local.world.dungeons }) }}>
              <div className='location-name'>{dungeon.name}</div>
              <div className='location-items'>{dungeon.mq === true ? 'Master' : 'Vanilla'}</div>
            </ListItem>
          )
        })}
      </List>
    )
  }
}
