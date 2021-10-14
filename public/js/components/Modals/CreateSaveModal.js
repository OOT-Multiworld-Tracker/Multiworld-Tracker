import React from 'react'
import { SaveUtils } from '../../app'
import Modal from './BaseModal'

export default class CreateSaveModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { name: '' }
    this.closeModal = this.props.onSave.bind(this)
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={this.state.name}
        content={
          <input type='text' className='form-control' placeholder='Save Name' onChange={(e) => { this.setState({ name: e.target.value }) }} />
        }
        footer={
          <button className='btn btn-default' style={{ width: '100%' }} onClick={() => { this.closeModal(); SaveUtils.Save(this.state.name) }}>Save</button>
        }
      />
    )
  }
}
