import React from 'react'
import app from '../../app'
import Player from '../Player'
export default class PlayerList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      worlds: app.worlds
    }

    this.handleWorldUpdate = this.handleWorldUpdate.bind(this)
  }

  handleWorldUpdate () {
    this.setState({ worlds: app.worlds })
  }

  componentDidMount () {
    app.subscribeToWorldUpdate(this.handleWorldUpdate)
    app.saveLoad.subscribe('load', this.handleWorldUpdate)
    app.subscribe('view', this.handleWorldUpdate)
  }

  componentWillUnmount () {
    app.unsubscribe('world update', this.handleWorldUpdate)
    app.saveLoad.unsubscribe('load', this.handleWorldUpdate)
    app.unsubscribe('view', this.handleWorldUpdate)
  }

  render () {
    return this.state.worlds.map(
      (world, index) => {
        return <Player key={index} current={world === app.local.world} world={index} save={world.save} />
      }
    )
  }
}
