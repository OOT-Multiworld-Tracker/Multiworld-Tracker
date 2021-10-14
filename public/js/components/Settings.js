import React from 'react'
import app from '../app'

export default class Settings extends React.Component {
  constructor () {
    super()
    this.state = { settings: app.global.settings }
  }

  changeSetting (id) {
    app.global.settings[id].Toggle()
    this.setState({ settings: app.global.settings })
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(app.global.settings).map((setting) => (<tr key={setting.name} onClick={() => this.changeSetting(setting)}><td>{app.global.settings[setting].name}</td><td>{(app.global.settings[setting].value === true ? 'Yes' : (app.global.settings[setting].value === false ? 'No' : app.global.settings[setting].value))}</td></tr>))}
        </tbody>
      </table>
    )
  }
}
