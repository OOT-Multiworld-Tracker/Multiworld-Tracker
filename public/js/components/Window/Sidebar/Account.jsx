import React from 'react'
import app, { SaveUtils } from '../../app'
import axios from 'axios'

import './Account.css'
import Saves from '../Saves'

const URL = "https://api.beyondapp.net/users/@me"

export default class Account extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      account: {}
    }

    this.handleLogin = this.handleLogin.bind(this)

  }

  handleLogin (account) {
      axios.get(URL, {
          headers: {
              "Authorization": "Bearer " + localStorage.token
          }
      }).then(response => {
            this.setState({
                account: response.data
            })   
      })
  }

  componentDidMount () {
      if (!localStorage.getItem('saves')) {
        SaveUtils.migrate()
      }

      axios.get(URL, {
          headers: {
              "Authorization": "Bearer " + localStorage.token
          }
      }).then(response => {
            this.setState({
                account: response.data
            })   
      })

      app.subscribe('account', this.handleLogin)
  }

  componentWillUnmount () {
  }

  render () {
    return (
        <>
        {(this.state.account.username &&
        <>
            <div className="account-container">
                <img className='avatar' src={this.state.account.avatar}/>
                <span className='location-items'>{this.state.account.username}</span>
            </div>
            <button className='btn' style={{width: '100%'}}　onClick={() => { localStorage.removeItem("token"); this.setState({ account: {} }) }}>Logout</button>
            <button className='btn' style={{width: '100%'}}>Import Cloud</button>

            <div className='list'>
                <div className='list-header'>Cloud Files</div>
                <div className='list-content'><Saves /></div>
            </div>
        </>
        ) || <button className='btn' style={{width: '100%'}} onClick={this.props.onLogin}>Login</button>}
        </>
    )
  }
}