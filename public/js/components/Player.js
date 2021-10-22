import React from 'react'
import app from '../app'
import Parser from '../classes/Parser'
import Translator from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'

import GreenRupee from '../../images/green_rupee.png'
import BlueRupee from '../../images/blue_rupee.png'
import RedRupee from '../../images/red_rupee.png'
import HeartContainer from '../../images/container.png'

export default class Player extends React.Component {
  static contextType = LanguageContext
  constructor (props) {
    super(props)
    this.state = { world: this.props.world, save: this.props.save }
  }

  generateContainers () {
    const elements = []
    for (let i = 0; i < this.props.save.heart_containers; i++) {
      elements.push(<span key={i} className='heart-container'><img src={HeartContainer} width='16' /></span>)

      if (elements.length === 10) elements.push(<br />)
    }
    return elements
  }

  render () {
    return (
      <div className='player'>
        <div style={this.props.current ? {color: '#222'} : null} className='character_name' onClick={() => (app.local.world = app.worlds[this.props.world])}><span>{this.props.save.player_name}</span> <span style={this.props.save.rupee_count == app.worlds[this.state.world].items.wallet.value ? {color: '#e08231'} : null }><img width='16' src={[GreenRupee, BlueRupee, RedRupee][app.worlds[this.state.world].items.wallet.Index()]} />{this.props.save.rupee_count}</span></div>
        <div className='heart_containers'>{this.generateContainers()}</div>
        <div className='progress' style={{width: app.worlds[this.state.world].save.magic_meter_size+'%'}}><div className='progress-bar' style={{width: app.worlds[this.state.world].save.magic_current+'%'}} /></div>
        {app.worlds.length > 1 ? <div>{Translator.GetTranslation(this.context.language, "World")} {this.state.world+1}</div> : null } {Parser.ParseScenes()[app.worlds[this.state.world].scene].name}
      </div>
    )
  }
}
