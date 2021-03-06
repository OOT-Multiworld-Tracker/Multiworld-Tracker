import React, { Component } from 'react'
import app from '../../app'
import { List, ListItem } from '../Lists'

export default class LocationHint extends Component {
  constructor (props) {
    super(props)

    this.state = { hints: app.local.world.locations.Accessible(false, false, -1).filter((location) => this.getKeyItem((location.item?.item||location.item)||"None")) }
    this.dismounted = false;
    this.onLocationUp = this.onLocationUp.bind(this)  
  }

  componentDidMount () {
    app.subscribe('locations update', this.onLocationUp)
    app.saveLoad.subscribe('load', this.onLocationUp)
    this.dismounted = false;
  }

  componentWillUnmount () {
    this.dismounted = true;
  }

  onLocationUp () {
      if (this.dismounted) return;

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
                <ListItem key={location.name}>
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
