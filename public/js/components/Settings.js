import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = { settings: app.global.settings }

    this.onSettingChange = this.onSettingChange.bind(this)
  }

  componentDidMount () {
    app.subscribeToSettingUpdate(this.onSettingChange)
  }

  componentWillUnmount () {
    app.unsubscribe('settings update', this.onSettingChange)
  }

  onSettingChange () {
    this.setState({ settings: Object.assign({}, app.global.settings) })
  }

  changeSetting (id) {
    app.global.settings[id].Toggle()
    this.setState({ settings: app.global.settings })
    app.call('locations update', app.local.world.locations)
  }

  render () {
    return (
      <List>
        {Object.keys(app.global.settings).map((setting) => (
          <ListItem key={setting.name} onClick={() => this.changeSetting(setting)}>
            <div className='location-name'>{app.global.settings[setting].name}</div>
            <div className='location-items'>{(app.global.settings[setting].value === true ? 'Yes' : (app.global.settings[setting].value === false ? 'No' : app.global.settings[setting].value))}</div>
          </ListItem>)
        )}
      </List>
    )
  }
}
