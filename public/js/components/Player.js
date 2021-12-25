import React from 'react'
import app from '../app'
import Parser from '../classes/Parser'
import { GetTranslation } from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'

import GreenRupee from '../../images/green_rupee.png'
import BlueRupee from '../../images/blue_rupee.png'
import RedRupee from '../../images/red_rupee.png'
import HeartContainer from '../../images/container.png'
import Bar from './ProgressBar/Bar'

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

  // Subscribe to world sync and save load events.
  componentDidMount () {
    if (!this.props.world) return;

    app.worlds[this.props.world].subscribeMany(['sync', 'update'], this.handleWorldSync)
    app.saveLoad.subscribe('load', this.handleWorldSync)
  }

  // Unsubscribe from world sync and save load events.
  componentWillUnmount () {
    if (!this.props.world) return;

    app.worlds[this.props.world].unsubscribeMany(['sync', 'update'], this.handleWorldSync)
    app.saveLoad.unsubscribe('load', this.handleWorldSync)
  }

  generateContainers (number) {
    const elements = []

    for (let i = 0; i < number; i++) {

      elements.push(<img key={i} className='heart-container' src={HeartContainer} width='16' />)

      if (elements.length === 10) 
        elements.push(<br />)

    }

    return elements
  }

  render () {
    let state = this.state.worldState || this.props.save

    return (
      <div className='player'>
        <div 
          className='character_name'

          onClick={
            _ => {
              if (app.worlds.length === 1) return; // Don't do anything with a single world.

              app.local.world = app.worlds[this.props.world]; 
              app.call('view', app.local.world)
            }
          }>

            <span>{(this.props.current) ? // Change name between save name and "You" depending on current.
              GetTranslation(this.context.language, "You") : state.save.player_name}</span>

            {state.items && <span style={(state.save.rupee_count === state.items.wallet.value) ? {color: '#e08231'} : null }>
              <img width='16' src={[GreenRupee, BlueRupee, RedRupee][state.items.wallet.Index()]} />

              {state.save.rupee_count}

              <span>
                /{state.items.wallet.value}
              </span>
            </span>}

        </div>

        <div className='heart-containers'>
          {this.generateContainers(state.save.heart_containers)}
        </div>

        { state.save.magic_meter_size > 0 && 
          <Bar 
            length = {50 * state.save.magic_meter_size} 
            fill = {2 * state.save.magic_current} />
        }

        { app.worlds.length > 1 && 
          <span>
            {GetTranslation(this.context.language, "World")} 
            {this.state.world+1}
          </span> 
        } <br/>
        
        <span className='scene_name'>
          {GetTranslation(this.context.language, Parser.ParseScenes()[state.scene].name)}
        </span>
      </div>
    )
  }
}
