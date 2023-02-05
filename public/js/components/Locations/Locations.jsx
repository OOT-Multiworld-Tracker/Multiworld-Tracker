import React, { Fragment, useEffect, useState } from 'react'
import app from '../../app'
import Parser from '../../classes/Parser'
import { List } from '../Lists'
import Location from './Location'
import PropTypes from 'prop-types'

export default function Locations ({ onContextMenu, targetedScene, pageData }) {
  const [locations, setLocations] = useState({})
  const [collapsed, setCollapsed] = useState({})

  // Event to handle when a location is clicked
  function handleLocationCheck (index, active) {
    locations[index] = active
    setLocations({ ...locations })
    app.local.world.locations.Array()[index].Mark() // Mark location as complete.
  }

  // Handle certain fired events
  useEffect(() => {
    // Update the locations when updated
    function onLocationUpdate () {
      setLocations({ ...locations })
    }

    // Subscribe to a location update
    app.subscribeToWorldUpdate(onLocationUpdate)
    app.subscribe('locations update', onLocationUpdate)

    // Clean up after activity
    return () => {
      app.unsubscribe('locations update', onLocationUpdate)
    }
  })

  const displayCompleted = pageData.page

  function makeLocationMap () {
    let lastScene = -1

    // Map all locations from a search.
    return app.local.world.locations.Search(pageData.search, targetedScene, displayCompleted).map((location, index) => {
      const locale = makeLocation(lastScene, location, index)
      lastScene = location.scene // Set the last scene to the current scene for catergor
      return locale
    })
  }

  function makeLocation (lastScene, location, index) {
    const scene = lastScene !== location.scene && targetedScene === -1 && <Location key={location.scene} onClick={() => { collapsed[location.scene] = !collapsed[location.scene]; setCollapsed({ ...collapsed }) }} type="header" location={{ name: Parser.ParseScenes()[lastScene = location.scene]?.name || 'Unknown' }} />

    // Display non-collapsed locations
    return (
        <Fragment key={index}>
            {scene}

            {(!collapsed[location.scene] || collapsed[location.scene] === false) && <Location
                onContextMenu={onContextMenu}
                location={location}
                index={index}
                onClick={handleLocationCheck}
                type="location"
            />}
        </Fragment>
    )
  }

  return (
        <List>
            {makeLocationMap()}
        </List>
  )
}

// props validation
Locations.propTypes = {
  onContextMenu: PropTypes.func.isRequired,
  targetedScene: PropTypes.number.isRequired,
  pageData: PropTypes.object.isRequired
}
