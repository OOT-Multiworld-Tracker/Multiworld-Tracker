import app from "../../../app"
import Parser from "../../../classes/Parser"

export default function SceneDropdown({ pageData, onSceneUpdate }) {
    function checkLocation (accessible, scene) {
        return accessible.some(location => location.scene === scene)
    }

    // Take the accessible scenes and display them in a dropdown
    function getScenes () {
        const accessible = app.local.world.locations.Accessible(pageData.page === 1, false, -1)
    
        const sceneList = Parser.ParseScenes().map(
          (scene) => 
            {
              if (checkLocation(accessible, String(scene.id))) {
                return (<option key={scene.id} value={scene.id}>{scene.name}</option>)
              } 
              else 
              {
                if (scene != -1 && scene === scene.id) {
                  return null
              }
    
              return null
            }
          }
        )
    
        return sceneList
    }

    return (
        <select 
            className='btn btn-bottom btn-default' 
            style={
            {
                marginRight: '1px' 
            }
            } 
            value={pageData.scene} 
            onChange={(e) => onSceneUpdate(e.target.value)}
        >
            <option value='-1'>Unsorted</option>
            {getScenes()}
        </select>
    )
}