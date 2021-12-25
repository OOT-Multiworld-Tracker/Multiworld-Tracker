import React from 'react'
import app from '../app'
import { KeyManager } from '../AppManagers'
import { GetTranslation } from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'
import { List, ListItem } from './Lists'

export default class Items extends React.Component {
  static contextType = LanguageContext
  constructor () {
    super()
    this.state = { items: app.local.world.save, search: "" }

    this.onWorldUpdate = this.onWorldUpdate.bind(this)
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
      <div style={{maxWidth: '260px',flexWrap: 'wrap', display:'flex'}}>
        {Object.values(app.local.world.items).filter((item) => item.name == this.state.search || this.state.search == '').map((item) => {
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
              <div className={`grid-item${item.Index() > 0 ? " active" : ""}`} onClick={() => {item.Toggle(); this.setState({ items: app.local.world.save })}}>
                <div style={{backgroundImage: `url(${item.Icon()})`}}>
                  {item.values.length > 2 && item.Index() > 0 && <span>{typeof item.value != "number" ? item.value.slice(0,1) : item.value}</span>}
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}
