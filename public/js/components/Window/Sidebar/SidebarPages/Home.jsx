import PlayerList from '../PlayerList'
import React from 'react'
import LocationHint from '../LocationHint'
import EntranceRandomizer from '../EntranceRandomizer'
import app from '../../../../app'
import PropTypes from 'prop-types'

export default function HomePage ({ connected }) {
  return (
      <>
        {connected ? <PlayerList /> : <p>Connect to a tracker to see the player list.</p>}
        <LocationHint />
        { app.global.settings.entranceSanity && <EntranceRandomizer />}
      </>
  )
}

HomePage.propTypes = {
  connected: PropTypes.bool.isRequired
}
