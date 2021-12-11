import React from 'react'
import Modal from './BaseModal'
import Axios from 'axios'
import app from '../../app';

export default class LoginModal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = this.props.onLogin.bind(this);
  }

  render () {
    return (
      <Modal
        onClick={(e) => e.stopPropagation()}
        title={this.props.save}
        content={
          <>
            Username <input className='form-control' id="username"/>
            Password <input className='form-control' id="password" type="password"/>
          </>
        }
        footer={
          <>
            <button className='btn btn-default' style={{ width: '100%' }} onClick={() => { Axios.post("https://api.beyondapp.net/login", {
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            }).then((response) => {
              localStorage.setItem("token", response.data.token)
              app.call('account', response.data.token)
            }) }}>Login</button>
          </>
        }
      />
    )
  }
}
