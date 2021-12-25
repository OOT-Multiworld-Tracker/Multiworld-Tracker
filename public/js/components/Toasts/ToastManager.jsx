import React from "react"
import app from "../../app"
import Toast from "./Toast"

import './Toast.css'


export default class ToastManager extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            toasts: []
        }

        this.timeouts = {}

        this.openSaveToast = this.openSaveToast.bind(this)
        this.openLoadToast = this.openLoadToast.bind(this)
    }

    componentDidMount () {
        app.saveLoad.subscribe("save", this.openSaveToast)
        app.saveLoad.subscribe("load", this.openLoadToast)
    }

    openSaveToast () {
        const toast = <Toast key={"Saved"} text={"Saved"} />;
        this.makeToast("save", toast);
    }

    openLoadToast () {
        console.log("Load")
        const toast = <Toast key={"Loaded"} text={"Loaded"} />;
        this.makeToast("load", toast);
    }

    makeToast (type, toast) {
        const toasts = this.state.toasts;
        toasts.push(toast)
        this.setState({ toasts })

        this.timeouts[type] = setTimeout(() => {
            toasts.splice(toasts.indexOf(toast), 1)
            this.setState({ toasts })
            delete this.timeouts[type]
        }, 5000);
    }

    render () {
        return (
            <div className='toast-container'>
                {this.state.toasts}
            </div>
        )
    }
}