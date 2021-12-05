import React from 'react';
import app from '../../app';
import Parser from '../../classes/Parser';
import { List, ListItem } from '../Lists';

export default class EntranceRandomizer extends React.Component {
    constructor (props) {
        super(props)

        this.state = { entrances: [], currentScene: app.global.scene }

        this.updateEntrances = this.updateEntrances.bind(this)
    }

    componentDidMount () {
        app.subscribe('entrance update', this.updateEntrances)
        app.saveLoad.subscribe('load', this.updateEntrances)
    }

    componentWillUnmount () {
        app.unsubscribe('entrance update', this.updateEntrances)
    }

    updateEntrances () {
        this.setState({ entrances: app.global.entrances })
    }

    render () {
        return app.global.settings.entranceSanity.value == true && (
            <div className='list'>
                <div className='list-header'>Entrance Tracking</div>
                <div className='list-content'>
                {app.global.entrances.filter((entrance) => {
                    return entrance[0] == app.local.world.scene
                }).map((entrance, i) => (
                    <ListItem key={i}>
                        <span>To {Parser.ParseScenes()[entrance[1]].name}</span>
                    </ListItem>
                ))}
                
                {app.global.entrances.filter((entrance) => {
                    return entrance[1] == app.local.world.scene
                }).map((entrance, i) => (
                    <ListItem key={i}>
                        <span>From {Parser.ParseScenes()[entrance[0]].name}</span>
                    </ListItem>
                ))}
                </div>
            </div>
        )
    }
}