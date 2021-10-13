import React from 'react'
import ReactDOM from 'react-dom'
import AppContext from './components/AppContext'
import Application from './components/Application'
import App from './app'

console.log(App)

ReactDOM.render(
  <AppContext.Provider value={App}>
    <Application />
  </AppContext.Provider>,

  document.getElementById('root')
)
