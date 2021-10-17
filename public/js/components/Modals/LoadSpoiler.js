import React from 'react'
import Modal from './BaseModal'

export default class SpoilerModal extends React.Component {
  loadSpoiler (e) {
    this.props.onSaveLoad(e, { dungeons: $('#import-dungeons').checked, automark: $('#automark').checked })
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={this.props.log.seed}
        content={
          <>
            <p><b>World Count</b>: {this.props.log.log.settings.world_count}</p>
            <hr />
            <input type='checkbox' class='form-control' id='import-dungeons' /> <label>Import Dungeons</label> <br />
            <input type='checkbox' class='form-control' id='automark' /> <label>Auto-mark Disabled Locations</label> <br />
            <hr />
          </>
        }
        footer={
          <>
            <button className='btn btn-default' style={{ width: '100%' }} onClick={() => { this.loadSpoiler() }}>Load</button>
          </>
        }
      />
    )
  }
}
