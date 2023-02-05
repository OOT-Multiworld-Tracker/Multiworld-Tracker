import React from 'react'
import app from '../../app'
import PropTypes from 'prop-types'

export default class LocationDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      id: 0,
      left: this.props.position.left,
      top: this.props.position.top
    }
    this.onDropdownClick = this.props.onDropdownClick.bind(this)
  }

  render () {
    return (
      this.props.display &&
          (
            <div
              className='dropdown'
              style={
                {
                  left: this.props.position.left,
                  top: this.props.position.top
                }
              }>
              <ul>

                <li onClick={_ => app.local.world.locations.Array()[this.state.id].Mark()}>Toggle Completed</li>
                <li onClick={_ => this.onDropdownClick(0)}>Set Item</li>

                <li className='dropdown-button'>Set Tag &gt;
                  <div
                    className='dropdown side'
                    style={
                      {
                        left: '180px',
                        bottom: '0px'
                      }
                    }>

                    <ul>

                      <li onClick={_ => this.onDropdownClick(1)}>Set Useless</li>
                      <li onClick={_ => this.onDropdownClick(2)}>Set Reminder</li>

                    </ul>

                  </div>
                </li>

              </ul>
            </div>
          )
    )
  }
}

// Locationdropdown props validation
LocationDropdown.propTypes = {
  display: PropTypes.bool.isRequired,
  position: PropTypes.object.isRequired,
  onDropdownClick: PropTypes.func.isRequired
}
