import React from 'react'
import app from '../app'
import { KeyManager } from '../AppManagers'
import { Item } from '../classes/Item'
import { GetTranslation } from '../classes/Translator'
import LanguageContext from '../components/LanguageContext'

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
        {Object.values(app.local.world.items).filter((item) => item.name == this.state.search || this.state.search == '').map(
          (item, index) => {
            if (item instanceof KeyManager) {
              const keyList = [
                <div className='list-header' key={item.name}>
                  <span className='location-name'>{GetTranslation(this.context.language, item.name)}</span>
                  <span className='location-items'>Have</span>
                </div>
              ];

              Object.values(item).forEach(keyManager => {
                if (!(keyManager instanceof Item)) return;

                keyList.push(
                  <div className={`grid-item${keyManager.Index() > 0 ? " active" : ""}`} key={keyManager.name} onClick={() => { keyManager.Toggle(); this.setState({ items: app.local.world.save }) }}>
                    <div style={{backgroundImage: `url(${keyManager.Icon()})`}}>
                      {keyManager.values.length > 2 && keyManager.Index() > 0 && <span>{keyManager.value}/{keyManager.values.length-1}</span>}
                    </div>
                  </div>
                );
              });
            
            return keyList;
          }

          return (
            <div key={item.name+index} className={`grid-item${item.Index() > 0 ? " active" : ""}`} onClick={() => {item.Toggle(); this.setState({ items: app.local.world.save })}}>
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
