import React from 'react'
import { hot } from 'react-hot-loader/root'
import './App.css'
import WindowBar from './WindowBar'

const App = () => {
  return (
    <div className="App">
      <WindowBar/>
    </div>
  )
}

export default hot(App)
