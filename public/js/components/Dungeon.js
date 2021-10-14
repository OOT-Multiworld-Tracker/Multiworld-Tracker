import React from 'react'
import app from '../app'

export default class Dungeons extends React.Component {
  constructor () {
    super()
    this.app = this.context
    this.state = { dungeons: app.local.world.dungeons }
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Dungeon</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {app.local.world.dungeons.map((dungeon) => {
            return (
              <tr key={dungeon.name} onClick={() => { dungeon.mq = !dungeon.mq; this.setState({ dungeons: app.local.world.dungeons }) }}>
                <td>{dungeon.name}</td>
                <td>{dungeon.mq === true ? 'Master' : 'Vanilla'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
