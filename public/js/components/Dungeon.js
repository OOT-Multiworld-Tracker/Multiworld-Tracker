import React from 'react';
import AppContext from './AppContext';

export default class Dungeons extends React.Component {
  static contextType = AppContext
  
  constructor () {
    super()
    this.app = this.context
    this.state = { dungeons: this.app.local.world.dungeons }
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
          {this.app.local.world.dungeons.map((dungeon) => {
            return (
              <tr key={dungeon.name} onClick={() => { dungeon.mq = !dungeon.mq; this.setState({ dungeons: this.app.local.world.dungeons }) }}>
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
