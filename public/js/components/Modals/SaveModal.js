import React from 'react'
import Modal from './BaseModal'
import { SaveUtils } from '../../app'
import Player from '../Player'
import Bar from '../ProgressBar/Bar'

export default class SaveModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onSaveLoad.bind(this);
  }

  render () {
    const save = JSON.parse(localStorage.saves).find(save => save.name === this.props.save).data.files[0]

    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={this.props.save}
        content={
          <>
            <Player save={save} hideWorld={true} />
            
            <Bar 
              width={100}
              fill={(save.locations.filter((loc) => (loc.completed && loc.completed === true)).length / save.locations.length) * 100}
            />
          </>
        }
        footer={
          <>
            <button className='btn btn-default' style={{ width: '33.3%' }} onClick={() => { this.closeModal(); SaveUtils.Load(this.props.save) }}>Load</button>
            <button className='btn btn-default' style={{ width: '33.3%' }} onClick={() => { this.closeModal(); SaveUtils.Save(this.props.save, JSON.parse(localStorage.saves).find(save => save.name === this.props.save).data) }}>Overwrite</button>
            <button className='btn btn-warning' style={{ width: '33.3%' }} onClick={() => { this.closeModal(); SaveUtils.Delete(this.props.save) }}>Delete</button>
          </>
        }
      />
    )
  }
}
