import React from "react"

import './Toast.css'


export default class Toast extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="toast">
                <div className="toast-message">
                    {this.props.text}
                </div>
            </div>
        )
    }
}