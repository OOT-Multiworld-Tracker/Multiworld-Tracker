import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = { settings: app.global.settings }

    this.changeSetting = this.changeSetting.bind(this)

    app.on('setting change', settings => {
      this.setState({ settings })
    })
  }

  changeSetting (id) {
    app.global.settings[id].Toggle()
    this.setState({ settings: app.global.settings })
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
