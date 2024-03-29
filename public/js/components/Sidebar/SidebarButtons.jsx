import React from 'react'
import LanguageContext from '../LanguageContext'
import { GetTranslation } from '../../classes/Translator'
import app from '../../app'

export default class SidebarButtons extends React.Component {
  static contextType = LanguageContext

  constructor () {
    super();
    this.state = {status: false}
    
    this.connection = this.connection.bind(this)
    app.subscribeToClientConnection(this.connection)
  }

  connection (status) {
    this.setState({status})
  }

  render () {
    return (
      <select className='form-control' onChange={this.props.onChange}>
        <option value='0'>{GetTranslation(this.context.language, 'World')}</option>
        <option value='3'>{GetTranslation(this.context.language, 'Items')}</option>
        <option value='1'>{GetTranslation(this.context.language, 'Saves')}</option>
        <option value='4'>{GetTranslation(this.context.language, 'Settings')}</option>
      </select>
    )
  }
  
}