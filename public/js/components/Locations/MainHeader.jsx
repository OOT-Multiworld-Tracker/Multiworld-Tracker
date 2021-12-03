import React, { Component } from 'react'
import app from '../../app'
import Parser from '../../classes/Parser'
import { ErrorBoundary } from '@sentry/react'
import Button from '../Buttons/Button'

export default class MainHeader extends Component {
    constructor (props) {
      super(props)
  
      this.onSceneUpdate = this.onSceneUpdate.bind(this)
    }
  
    onSceneUpdate (scene) {
      this.setState({ scene: Parser.ParseScenes().filter(sceneOb => (this.checkLocation(app.local.world.locations.Accessible(), scene) && sceneOb.id == scene).length > 0) ? scene : -1 })
    }
    
    componentDidMount () {
      app.local.world.subscribeChangeScene(this.onSceneUpdate)
    }
  
    shouldComponentUpdate (nextProps, nextState) {
      return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
    }
  
    checkLocation (accessible, scene) {
      return accessible.some(location => location.scene === scene)
    }
  
    getScenes () {
      const accessible = app.local.world.locations.Accessible(this.props.page === 1, false, -1)
  
      const sceneList = Parser.ParseScenes().map(
        (scene) => 
          {
            if (this.checkLocation(accessible, String(scene.id))) {
              return (<option key={scene.id} value={scene.id}>{scene.name}</option>)
            } 
            else 
            {
              if (this.props.scene === scene.id) {
                this.props.onSceneChange(-1)
                return null
            }
  
            return null
          }
        }
      )
  
      return sceneList
    }
  
    render () {
      return (
      <>
      <ErrorBoundary fallback={<p>Search failed to load</p>}>
        <input type='text' className='form-control search-bar' onChange={(e) => this.props.onSearch({ search: e.target.value })} placeholder='Search...' />
      </ErrorBoundary>
      <div className='btn-group' style={{ width: '100%', marginBottom: '4px' }}>
        <select 
          className='btn btn-bottom btn-default' 
          style={
            { 
              width: '33.34%', 
              marginRight: '1px' 
            }
          } 
  
          value={this.props.scene} 
          onChange={(e) => this.props.onSceneChange(e.target.value)}
        >
        
          <option value='-1'>None</option>
          {this.getScenes()}
          
        </select>
  
        <Button theme="bottom" style={{ 
            width: '33.34%', 
            backgroundColor: (this.props.page === 0) ? '#444' : null 
        }} onClick={() => this.props.onPageClick(0)}>
            Accessible <span className='badge'> { app.local.world.locations.Accessible(false, false, -1).length } </span>
        </Button>

        <Button theme="bottom" style={{ 
            width: '33.34%', 
            backgroundColor: (this.props.page === 1) ? '#444' : null 
        }} onClick={() => this.props.onPageClick(1)}>
            Completed <span className='badge'>{ app.local.world.locations.Get(true).length }</span>
        </Button>
      </div>
      </>
      )
    }
  }