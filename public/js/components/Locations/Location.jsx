import { ErrorBoundary } from "@sentry/react";
import app from "../../app";
import { ListItem } from "../Lists";

export default function Location({ onContextMenu, onClick, type, location }) {
    return (
        <ErrorBoundary fallback={<p>Location Failed to Load</p>}>
            <ListItem
                type={type}
                onClick={() => onClick(location.id, !location.completed)}
                onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, location.id) }}>

                <div className='location-name'>
                    {location.name}
                    {(app.global.settings.playerHints && app.global.settings.playerHints.value == true && type != "header") &&
                        <span className='badge'>{app.local.world.locations.Array()[location.id]?.item.player || "?"}</span>}
                </div>

                <div className='location-items'>
                    {app.global.settings.itemHints && app.global.settings.itemHints.value === 'show items' ? (location.item.item) : 
                    (location.item && location.item.item ? <>{location.item.item} <span className='badge'>{location.item.price}</span></> : location.item)}
                </div>
            </ListItem>
        </ErrorBoundary>
    )
}
