import React from 'react'
import ReactDOM from 'react-dom'
import Application from './components/Application'
import { withProfiler } from '@sentry/react'

ReactDOM.render(
  withProfiler(<Application />),

  document.getElementById('root')
)
