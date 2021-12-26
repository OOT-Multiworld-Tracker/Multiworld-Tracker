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
    this.state = { items: app.local.world.save }

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

  makeGridElement (item) {
    return (
      <div 
        key={item.name+index} 
        className={`grid-item${item.Index() > 0 ? " active" : ""}`} 
        onClick={() => {item.Toggle(); this.setState({ items: app.local.world.save })}}>

          <div style={{backgroundImage: `url(${item.Icon()})`}}>
            { item.values.length > 2 && item.Index ( ) > 0 && 
              <span>
                { (typeof item.value != "number") ? item.value.slice ( 0, 1 ) : item.value }
              </span>
            }
          </div>

      </div>
    )
  }

  render () {
    return (
      <div style={{maxWidth: '260px',flexWrap: 'wrap', display:'flex'}}>
      {
        // Turn to item list into an array of values for indexing.
        Object.values(app.local.world.items).map( item => {
          if (item instanceof KeyManager) {
            const keyList = [
              <div className='list-header' key={item.name}>
                <span className='location-name'>{GetTranslation(this.context.language, item.name)}</span>
                <span className='location-items'>Have</span>
              </div>
            ];

            Object.values(item).forEach(keyManager => {
              if (!(keyManager instanceof Item)) return;
              keyList.push(this.makeGridElement(keyManager)); 
            });
            
            return keyList;
          }

          return this.makeGridElement(item);
        })
      }
      </div>
    )
  }
}
