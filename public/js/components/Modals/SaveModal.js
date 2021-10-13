import React from 'react'
import Modal from './BaseModal'
import { SaveUtils } from '../../app'
import Player from '../Player'

export default class SaveModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onSaveLoad.bind(this);
  }

  render () {
    const save = JSON.parse(localStorage.getItem(this.props.save));
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={this.props.save}
        content={
          <>
            <Player save={save.save} />
            <div className='progress'>
              <div className='progress-bar' style={{ width: (save.locations.filter((loc) => (loc.completed && loc.completed === true)).length / save.locations.length) * 100 + '%' }}>{save.locations.filter((loc) => (loc.completed　&& loc.completed == true)).length}</div>
            </div>
          </>
        }
        footer={
          <>
            <button className='btn btn-default' style={{ width: '50%' }} onClick={() => { this.closeModal(); SaveUtils.Load(this.props.save) }}>Load</button>
            <button className='btn btn-warning' style={{ width: '50%' }} onClick={() => { this.closeModal(); localStorage.removeItem(this.props.save) }}>Delete</button>
          </>
        }
      />
    )
  }
}
