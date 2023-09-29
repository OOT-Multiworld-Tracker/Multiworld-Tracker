import React, { useEffect, useState } from 'react'
import app from '../../app'
import Button from '../Buttons/Button'
import ButtonGroup from '../Buttons/ButtonGroup'
import SceneDropdown from './SceneDropdown/SceneDropdown'
import PropTypes from 'prop-types'

export default function MainHeader ({ type, pageData, onSearch, onSceneUpdate, onPageUpdate, onTypeUpdate }) {
  const [accessible, setAccessible] = useState(0)
  const [complete, setComplete] = useState(0)

  useEffect(() => {
    function onLocationUpdate () {
      setAccessible(app.local.world.locations.Accessible(false).length)
      setComplete(app.local.world.locations.Completed().length)
    }

    // Subscribe to a location update
    app.subscribeToWorldUpdate(onLocationUpdate)
    app.subscribe('locations update', onLocationUpdate)

    // Clean up after activity
    return function cleanup () {
      app.unsubscribe('locations update', onLocationUpdate)
    }
  })

  return (
    <>
      <input type='text' className='form-control search-bar' onChange={(e) => onSearch({ search: e.target.value })} placeholder='Search...' />

      {app.walkthrough && <ButtonGroup fullWidth={true}>
        <Button theme="bottom" style={{
          backgroundColor: (type === 0) ? '#444' : null
        }} onClick={() => onTypeUpdate(0)}>
          Tracker
        </Button>

        <Button theme="bottom" style={{
          backgroundColor: (type === 1) ? '#444' : null
        }} onClick={() => onTypeUpdate(1)}>
          Walkthrough
        </Button>
      </ButtonGroup>}

      <ButtonGroup fullWidth={true}>
        <SceneDropdown pageData={pageData} onSceneUpdate={onSceneUpdate} />

        <Button theme="bottom" style={{
          backgroundColor: (pageData.page === 0) ? '#444' : null
        }} onClick={() => onPageUpdate(0)}>
          Accessible <span className='badge'> {accessible} </span>
        </Button>

        <Button theme="bottom" style={{
          backgroundColor: (pageData.page === 1) ? '#444' : null
        }} onClick={() => onPageUpdate(1)}>
          Completed <span className='badge'>{complete}</span>
        </Button>
      </ButtonGroup>
    </>
  )
}

// props validation
MainHeader.propTypes = {
  type: PropTypes.number.isRequired,
  pageData: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSceneUpdate: PropTypes.func.isRequired,
  onPageUpdate: PropTypes.func.isRequired,
  onTypeUpdate: PropTypes.func.isRequired
}
