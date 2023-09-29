import React from 'react'
import Modal from './BaseModal'
import { List, ListItem } from '../Lists'
import app from '../../app'
import GreenRupee from '../../../images/green_rupee.png'
import Button from '../Buttons/Button'
import PropTypes from 'prop-types'

export default class ItemModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
      category: -1
    }

    this.closeModal = this.props.onItemSet.bind(this)

    // The default categories before being auto-filled.
    this.categories = [
      { name: 'Uncategorized', items: [] },

      {
        name: 'Junk',
        items: [
          { name: 'Rupee', Icon: () => GreenRupee },
          { name: 'Buy Deku Nuts' },
          { name: 'Buy Deku Stick' },
          { name: 'Buy Bombs' },
          { name: 'Buy Arrows' },
          { name: 'Buy Bombchus' }
        ]
      }
    ]

    // Sort all of the items into categorized lists.
    Object.values(app.local.world.items).forEach(
      (item) => {
        // Put in uncategorized if no category is present.
        if (!item.category) {
          this.categories[0].items.push(item)
        } else {
          // Create a new category if it doesn't exist.
          if (!this.categories.find((category) => category.name === item.category)) {
            this.categories.push({ name: item.category, items: [] })
          }

          this.categories.find((category) => category.name === item.category).items.push(item) // Add the item to the category.
        }
      }
    )
  }

  setItem (e, item) {
    app.local.world.locations.locations.get(String(this.props.location)).display = { name: item.name }
    e.stopPropagation()
    this.closeModal(e)
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title='Select Item'
        footer={
          <>
            {this.state.category !== -1 && // Display a back button when on a category.
              <button className='btn' onClick={_ => this.setState({ category: -1 })}>Back</button>}

            <Button
              onClick={
                e => {
                  app.local.world.locations.locations.get(String(this.props.location)).display = { name: 'None' }
                  e.stopPropagation()
                  this.closeModal(e)
                }
                }>Unset</Button>
          </>
        }

        content=
        {
          <>
            <input type='text' className='form-control search-bar' placeholder='Item name' onChange={(e) => this.setState({ search: e.target.value })} />

            <div style={{ overflowY: 'scroll', height: '329px' }}>
              <List>
                {
                  (this.categories[this.state.category]?.items || this.categories).filter( // If an item list is avalible then list it, otherwise categorizes.
                    (item) =>
                      (item.name.toLowerCase().includes(this.state.search.toLowerCase()) || this.state.search === '') // non-case-sensitive search.
                  ).map(

                    (item, index) => {
                      return (

                          <ListItem key={item.name} onClick={e => (this.state.category === -1) ? this.setState({ category: index }) : this.setItem(e, item)}>
                            <div className='location-name'>
                              {this.state.category === -1 && <img src={ item.items[0].Icon() }/>}
                                {item.name}
                            </div>
                          </ListItem>

                      )
                    }

                  )
                }
              </List>
            </div>
          </>
        }
      />
    )
  }
}

// props validation
ItemModal.propTypes = {
  onItemSet: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired
}
