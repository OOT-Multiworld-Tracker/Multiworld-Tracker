import React, { Component } from 'react'
import app from '../../app'
import { List, ListItem } from '../Lists'

export default class LocationHint extends Component {
  constructor (props) {
    super(props)

    this.state = { hints: app.local.world.locations.Accessible(false, false, -1).filter((location) => this.getKeyItem((location.item?.item||location.item)||"None")) }
  
    this.onLocationUpdate = this.onLocationUpdate.bind(this)  
  }

  componentDidMount () {
    app.subscribe('locations update', this.onLocationUpdate)
    app.saveLoad.subscribe('load', this.onLocationUpdate)
  }

  componentWillUnmount () {
    app.unsubscribe('locations update', this.onLocationUpdate)
    app.saveLoad.unsubscribe('load', this.onLocationUpdate)
  }

  onLocationUpdate () {
      this.setState({ hints: app.local.world.locations.Accessible(false, false, -1).filter((location) => this.getKeyItem((location.item?.item||location.item)||"None")) })
  }

  getKeyItem (name) {
      return Object.values(app.local.world.items).find(item => { return item.name == name }) != null;
  }

  render () {
    return (
    <>
      <List>
          <div className='list-header'>
              Item Hints
          </div>
          {app.local.world.locations.Accessible(false, false, -1).filter((location) => this.getKeyItem((location.item?.item||location.item)||"None")).map(
            (location) => (
                <ListItem>
                    <div className='location-name'>
                        <span>{location.name}</span>
                    </div>
                </ListItem>   
          ))}
      </List>
    </>
    )
  }
}
