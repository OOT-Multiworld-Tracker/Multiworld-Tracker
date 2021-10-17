import React from 'react'
import app from '../app'
import { List, ListItem } from './Lists'

export default class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = { settings: this.props.settings }
  }

  changeSetting (id) {
    this.props.settings[id].Toggle()
    this.setState({ settings: this.props.settings })
  }

  render () {
    return (
      <List>
        {Object.keys(this.props.settings).map((setting) => (
          <ListItem key={setting.name} onClick={() => this.changeSetting(setting)}>
            <div className='location-name'>{this.props.settings[setting].name}</div>
            <div className='location-items'>{(this.props.settings[setting].value === true ? 'Yes' : (this.props.settings[setting].value === false ? 'No' : this.props.settings[setting].value))}</div>
          </ListItem>)
        )}
      </List>
    )
  }
}
