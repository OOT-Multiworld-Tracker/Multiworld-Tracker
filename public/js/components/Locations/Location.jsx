import { ErrorBoundary } from "@sentry/react";
import app from "../../app";
import { ListItem } from "../Lists";

export default function Location({ onContextMenu, onClick, type, location }) {
    function getSpoilerItem() {
        if (app.global.settings["item hints"] && app.global.settings["item hints"].value === 'show') {
            // if item.item exists use that instead
            if (app.local.world.locations.Array()[location.id]?.item.item) {
                return app.local.world.locations.Array()[location.id].item.item
            }
            return app.local.world.locations.Array()[location.id]?.item || "?"
        }
        return null
    }

    return (
        <ErrorBoundary fallback={<p>Location Failed to Load</p>}>
            <ListItem
                type={type}
                onClick={() => onClick(location.id, !location.completed)}
                onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, location.id) }}>

                <div className='location-name'>
                    {location.name}&nbsp;
                    {(app.global.settings["player hints"] && app.global.settings["player hints"].Index() == 1 && type != "header") &&
                        <span className='badge'>{app.local.world.locations.Array()[location.id]?.item.player || "?"}</span>}
                </div>

                <div className='location-items'>
                    {getSpoilerItem()}
                </div>
            </ListItem>
        </ErrorBoundary>
    )
}
