import React from 'react'

export default function SavePage () {
  return (
        <>
          <button className='btn btn-dark' style={{ marginBottom: '4px', width: '100%', backgroundColor: 'rgb(113 47 47)' }} onClick={() => SaveUtils.Reset()}>Start Over</button>
          <br />
          <div className='list'>
            <div className='list-header'><span className='location-name'>Files</span> <span onClick={this.props.onSave} className='location-items btn btn-default icon icon-plus' /></div>
            <div className='list-content'><Saves saves={this.props.saves} onSaveClick={this.props.onModal} /></div>
          </div>
        </>
  )
}
