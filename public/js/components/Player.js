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
        <div className='character_name' onClick={() => this.openStats()}>{this.state.save.player_name} <img width='16' src='/images/green_rupee.png' />{this.state.save.rupee_count}</div>
        <div className='heart_containers'>{this.generateContainers()}</div>
      </div>
    )
  }
}
