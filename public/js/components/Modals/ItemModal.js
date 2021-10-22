import React from 'react'
import Modal from './BaseModal'
import { List, ListItem } from '../Lists'
import app from '../../app'

export default class ItemModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onItemSet.bind(this)
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title='Item'
        content={
          <List>
            <ListItem onClick={e => { app.local.world.locations.locations.get(String(this.props.location)).display = { name: 'None' }; e.stopPropagation(); this.closeModal(e) }}>
              <div className='location-name'>None</div>
            </ListItem>
            {Object.values(app.local.world.items).map((item) => {
              return (
                <ListItem key={item.name} onClick={e => { app.local.world.locations.locations.get(String(this.props.location)).display = { name: item.name }; e.stopPropagation(); this.closeModal(e) }}>
                  <div className='location-name'>{item.name}</div>
                </ListItem>
              )
            })}
          </List>
        }
      />
    )
  }
}
