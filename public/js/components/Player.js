import React from 'react'
import app from '../app'
import Parser from '../classes/Parser'
import { GetTranslation } from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'

import GreenRupee from '../../images/green_rupee.png'
import BlueRupee from '../../images/blue_rupee.png'
import RedRupee from '../../images/red_rupee.png'
import HeartContainer from '../../images/container.png'

export default class Player extends React.Component {
  static contextType = LanguageContext

  constructor (props) {
    super(props)
    this.state = { world: this.props.world, worldState: app.worlds[this.props.world] }

    this.handleWorldSync = this.handleWorldSync.bind(this)
  }

  handleWorldSync () {
    this.setState({ worldState: app.worlds[this.state.world] })
  }

  componentDidMount () {
    app.worlds[this.props.world].subscribe('sync', this.handleWorldSync)
    app.worlds[this.props.world].subscribe('update', this.handleWorldSync)
    app.saveLoad.subscribe('load', this.handleWorldSync)
  }

  generateContainers () {
    const elements = []
    for (let i = 0; i < this.state.worldState.save.heart_containers; i++) {
      elements.push(<span key={i} className='heart-container'><img src={HeartContainer} width='16' /></span>)

      if (elements.length === 10) elements.push(<br />)
    }
    return elements
  }

  render () {
    return (
      <div className='player'>
        <div 
          className='character_name' 
          onClick={() => {
            app.local.world = app.worlds[this.props.world]; 
            app.call('view', app.local.world)
          }}>
            <span>{this.props.current ? "You" : this.state.worldState.save.player_name}</span> 
            <span style={this.state.worldState.save.rupee_count == this.state.worldState.items.wallet.value ? {color: '#e08231'} : null }>
              <img width='16' src={[GreenRupee, BlueRupee, RedRupee][this.state.worldState.items.wallet.Index()]} />{this.state.worldState.save.rupee_count}<span style={{fontSize: 9, color: '#BBB', marginLeft: '2px'}}>/{this.state.worldState.items.wallet.value}</span>
            </span>
          </div>

        <div className='heart_containers'>{this.generateContainers()}</div>
        <div className='progress' style={{width: 50 * this.state.worldState.save.magic_meter_size+'%'}}><div className='progress-bar' style={{width: 2 * this.state.worldState.save.magic_current+'%'}} /></div>
        {app.worlds.length > 1 ? <div>{GetTranslation(this.context.language, "World")} {this.state.world+1}</div> : null } 
        <span className='scene_name'>{Parser.ParseScenes()[this.state.worldState.scene].name}</span>
      </div>
    )
  }
}
