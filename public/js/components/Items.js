import React from 'react'
import app from '../app'
import { KeyManager } from '../AppManagers'
import { GetTranslation } from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'

export default class Items extends React.Component {
  static contextType = LanguageContext
  constructor () {
    super()
    this.state = { items: app.local.world.save }
  }

  onWorldUpdate () {
    this.setState({ items: app.local.world.save })
  }

  componentDidMount () {
    app.subscribeToWorldUpdate(this.onWorldUpdate)
  }

  componentWillUnmount () {
    app.unsubscribe('world update', this.onWorldUpdate)
  }

  render () {
    return (
      <table className='table-striped'>
        <thead>
          <tr>
            <th>Item</th>
            <th>Have</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(app.local.world.items).map((item) => {
            if (item instanceof KeyManager) {
              return [(
                <tr key={item.name}>
                  <th>{GetTranslation(this.context.language, item.name)}</th>
                  <th>Have</th>
                </tr>
              ), (
                <tr key={item.smallKeys.name} onClick={() => { item.smallKeys.Toggle(); this.setState({ items: app.local.world.save }) }}>
                  <td>{item.smallKeys.name}</td>
                  <td>{item.smallKeys.value}</td>
                </tr>
              ), (
                <tr key={item.bigKey.name} onClick={() => { item.bigKey.Toggle(); this.setState({ items: app.local.world.save }) }}>
                  <td>{item.bigKey.name}</td>
                  <td>{item.bigKey.value}</td>
                </tr>
              )]
            }

            return (
              <tr key={item.name} onClick={() => { item.Toggle(); this.setState({ items: app.local.world.save }) }}>
                <td>{GetTranslation(this.context.language, item.name)}</td>
                <td>{item.value === '0' ? 'None' : (item.value === '1' ? 'Have' : item.value)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
