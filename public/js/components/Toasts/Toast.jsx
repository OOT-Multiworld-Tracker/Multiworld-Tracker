import React from "react"
import app from "../../app"

import './Toast.css'


export default class Toast extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            show: false,
            message: "Unset"
        }
    
        this.timeout;

        this.openSaveToast = this.openSaveToast.bind(this)
    }

    componentDidMount () {
        app.saveLoad.subscribe("save", this.openSaveToast)
    }

    openSaveToast () {
        this.setState({
            show: true,
            message: "Saved!"
        })

        if (this.timeout) return;

        this.timeout = setTimeout(() => {
            this.setState({
                show: false
            })

            this.timeout = null;
        }, 7000)
    }

    render () {
        return this.state.show && (
            <div className="toast-container">
                <div className="toast-message">
                    {this.state.message}
                </div>
            </div>
        )
    }
}