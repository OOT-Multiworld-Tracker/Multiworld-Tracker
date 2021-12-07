import React from 'react'
import Modal from './BaseModal'
import { List, ListItem } from '../Lists'
import app from '../../app'
import GreenRupee from '../../../images/green_rupee.png'

export default class ItemModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { search: '', category: -1 }
    this.closeModal = this.props.onItemSet.bind(this)

    this.categories = [{name:"Uncategorized", items:[]},{name:"Junk", items: [
      {name:"Rupee", Icon: () => GreenRupee},
      {name:"Buy Deku Nuts"},
      {name:"Buy Deku Stick"},
      {name:"Buy Bombs"},
      {name:"Buy Arrows"},
      {name:"Buy Bombchus"}
    ]}];

    Object.values(app.local.world.items).forEach((item) => {
      if (!item.category) this.categories[0].items.push(item)
      else {
        
        if (!this.categories.find((cat) => cat.name == item.category)) { 
        this.categories.push({name:item.category, items:[]})
        this.categories.find((cat) => cat.name == item.category).items.push(item)
      } else {
        this.categories.find((cat) => cat.name == item.category).items.push(item)
      } }
    })
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title='Item'
        footer={
          <>
          {this.state.category != -1 && 
            <button className='btn' onClick={() => this.setState({ category: -1 })}>Back</button>}

          <button className='btn' onClick={e => { app.local.world.locations.locations.get(String(this.props.location)).display = { name: 'None' }; e.stopPropagation(); this.closeModal(e) }}>Deselect</button>
          </>
        }
        content={
          <>
          <input type='text' className='form-control search-bar' placeholder='Item name' onChange={(e) => this.setState({search: e.target.value})} ref='itemName' />
          <div style={{overflowY:'scroll',height:'329px'}}>
          <List>
            {this.state.category == -1 && this.categories.filter((item) => item.name.toLowerCase().includes(this.state.search) || this.state.search == '').map((item, index) => {
              return (
                <ListItem key={item.name} onClick={e => this.setState({ category: index })}>
                  <div className='location-name'><img style={{width: '24px', height: '32px', verticalAlign: 'middle', marginRight: '4px'}} src={item.items[0].Icon()}/>{item.name}</div>
                </ListItem>
              )
            })}

            {this.state.category != -1 && this.categories[this.state.category].items.filter((item) => item.name.toLowerCase().includes(this.state.search) || this.state.search == '').map((item) => {
              return (
                <ListItem key={item.name} onClick={e => { app.local.world.locations.locations.get(String(this.props.location)).display = { name: item.name }; e.stopPropagation(); this.closeModal(e) }}>
                  <div className='location-name'>{item.name}</div>
                </ListItem>
              )
            })}
          </List>
          </div>
          </>
        }
      />
    )
  }
}
