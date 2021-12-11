import React from 'react'

export default class Bar extends React.Component {
    constructor (props) {
        super (props)
    }

    render () {
        return (
            <div className='progress' style={{ width: this.props.length + '%' }}>
                <div className='progress-bar' style={{ width: this.props.fill + '%' }} />
            </div>
        )
    }
}