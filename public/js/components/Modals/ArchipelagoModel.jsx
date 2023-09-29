import React from 'react'
import Modal from './BaseModal'
import app from '../../app'

export default class LoginModal extends React.Component {
  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={'Connect with Archipelago'}
        content={
          <>
            Hostname <input className='form-control' id="hostname" defaultValue={'archipelago.gg'} />
            Port <input className='form-control' id="port" defaultValue={''} />
            Name <input className='form-control' id="username" />
          </>
        }
        footer={
          <>
            <button className='btn btn-default' style={{ width: '100%' }} onClick={() => { app.networking.ConnectArchipelago({
              id: 1,
              hostname: document.getElementById("hostname").value,
              port: parseInt(document.getElementById("port").value),
              username: document.getElementById("username").value})}}>Login</button>
          </>
        }
      />
    )
  }
}
