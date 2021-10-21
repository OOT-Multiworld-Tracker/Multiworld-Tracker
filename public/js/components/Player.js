import React from 'react'
import app from '../app'

export default class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = { world: this.props.world, save: this.props.save }
  }

  componentDidMount () {
    this.timer = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  tick () {
    this.setState({ save: app.worlds[this.state.world].save })
  }

  generateContainers () {
    const elements = []
    for (let i = 0; i < this.state.save.heart_containers; i++) {
      elements.push(<span className='heart-container'><img src='/images/container.png' width='16' /></span>)

      if (elements.length === 10) elements.push(<br />)
    }
    return elements
  }

  render () {
    return (
      <div className='player'>
        <div style={this.props.current ? {color: '#222'} : null} className='character_name' onClick={() => (app.local.world = app.worlds[this.props.world])}><span>{this.state.save.player_name}</span> <span><img width='16' src={app.worlds[this.state.world].items.wallet.Index() == 0 ? '/images/green_rupee.png' : '/images/blue_rupee.png'} />{this.state.save.rupee_count}</span></div>
        <div className='heart_containers'>{this.generateContainers()}</div>
        {app.worlds.length > 1 ? <div>World {this.props.save.world}</div> : null }
      </div>
    )
  }
}
