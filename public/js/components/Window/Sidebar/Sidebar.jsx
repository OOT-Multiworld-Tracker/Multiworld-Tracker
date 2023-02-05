import React, { useState } from 'react'
import { GetTranslation } from '../../../classes/Translator';

import './Sidebar.css'
import Pages from './SidebarPages/Pages'

export default function Sidebar ({ connected }) {
  const [page, setPage] = useState(0);
  const pages = [<Pages.Home connected={connected} key={0} />, <Pages.Saves key={1} />, null, this.itemPage(), this.settingsPage(), this.accountPage()];

  return (
    <div className='pane-md' style={{ minWidth: '240px' }}>
      <Sidebar.Dropdown onChange={setPage} />
      {pages[page]}
    </div>
  )
}

Sidebar.Dropdown = function SidebarDropdown ({ onChange }) {
  return (
    <select className='form-control' onChange={onChange}>
      <option value='0'>{GetTranslation(this.context.language, 'World')}</option>
      <option value='3'>{GetTranslation(this.context.language, 'Items')}</option>
      <option value='1'>{GetTranslation(this.context.language, 'Saves')}</option>
      <option value='4'>{GetTranslation(this.context.language, 'Settings')}</option>
      <option value='5'>{GetTranslation(this.context.language, 'My Account')}</option>
    </select>
  )
}