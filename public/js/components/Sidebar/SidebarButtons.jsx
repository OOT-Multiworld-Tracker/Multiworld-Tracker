import React from 'react'
import LanguageContext from '../LanguageContext'
import { GetTranslation } from '../../classes/Translator'

export default class SidebarButtons extends React.Component {
  static contextType = LanguageContext

  render () {
    return (
      <select className='form-control' onChange={this.props.onChange}>
        <option value='0'>{GetTranslation(this.context.language, 'World')}</option>
        <option value='1'>{GetTranslation(this.context.language, 'Saves')}</option>
        <option value='3'>{GetTranslation(this.context.language, 'Items')}</option>
        <option value='4'>{GetTranslation(this.context.language, 'Settings')}</option>
        <option value='5'>{GetTranslation(this.context.language, 'My Account')}</option>
      </select>
    )
  }
  
}