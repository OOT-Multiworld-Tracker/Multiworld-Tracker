import { SettingsManager, ItemManager, LocationManager } from './AppManagers'
import GameManager from './classes/GameManager'
import { GameWorld } from './classes/GameWorld'
import { Item } from './classes/Item'
import { NetworkManager } from './classes/NetworkingManager'
import { Subscription } from './classes/Subscription'

class AppSubscriptions extends Subscription {
  constructor () {
    super(['connection', 'world update', 'view', 'settings update', 'locations update', 'entrance update', 'account'])
  }

  subscribeToClientConnection (callback) {
    this.subscribe('connection', callback)
  }

  subscribeToWorldUpdate (callback) {
    this.subscribe('world update', callback)
  }

  subscribeToSettingUpdate (callback) {
    this.subscribe('settings update', callback)
  }
}

export class App extends AppSubscriptions {
  constructor () {
    super()

    this.local = {
      world: new GameWorld(this),
      scene: -1
    }

    this.global = {
      connected: false,
      settings: new SettingsManager(),
      scene: -1,
      world: 0,
      entrances: []
    }

    this.saveLoad = new Subscription(['save', 'load', 'reset'])

    /**
     * The present electron IPC manager.
     * @type {NetworkManager}
     */
    this.networking = null

    /**
     * The current game world(s).
     * @type {Array[GameWorld]}
     */
    this.worlds = [new GameWorld(this)] // Spawn with a default world instance.
    this.local.world = this.worlds[0]

    this.lastChestID = -1
  }

  /**
   * Generate a new list of worlds based from the supplied count.
   * @param {Number} count 
   */
  makeWorlds (count) {
    this.worlds = [];
    for (let i = 0; i < count; i++) this.worlds.push(new GameWorld(this));
  }
}

const app = new App()

setTimeout(() => {
  if (localStorage.getItem('autosave') != null) {
    SaveUtils.Load('autosave')
  }
}, 1000)

function Autosave () {
  SaveUtils.Save('autosave')
}

setInterval(Autosave, 10000)

export class SaveUtils {
  static migrate () {
    const saves = []
    Object.entries(localStorage).forEach(([key, value]) => {
      saves.push({name: key, data: JSON.parse(value)})
    })
    localStorage.clear();
    localStorage.saves = JSON.stringify(saves)
  }
  /**
   * Returns a key-array of all save files.
   * @returns {String[]}}
   */
  static GetFiles () {
    return localStorage.saves
  }

  static Delete (name) {
    localStorage.removeItem(name)
  }

  static async Reset () {
    app.global.settings = new SettingsManager()
    app.worlds = [new GameWorld(app)]
    app.local.world = app.worlds[0]

    app.saveLoad.call('load')
    app.local.world.call('update')
  }

  /**
   * Save the current game state to localStorage, returns file.
   * @param {*} name
   * @returns {Promise<Object>}
   */
  static async Save (name) {
    return new Promise((resolve, reject) => {
      const saveFiles = app.worlds.map((world) => 
        Object.assign({ }, { // Assign all of the values to the file.
          dungeons: world.dungeons, save: world.save, items: world.items, settings: app.global.settings.Serialize(),
          locations: world.locations.Array().map((location) => { return { completed: location.completed, item: location.item, display: location.display, name: location.name, preExit: location.preExit, scene: location.scene } }),
          scene: world.scene, game: GameManager.GetSelectedGame().name, entrances: app.global.entrances
        })
      )

      var saves = JSON.parse(localStorage.saves) || [];
      var saveLoc = (JSON.parse(localStorage.saves || [])).find( save => ( save.name === name ) ), // Set a default save state.
        save = { name, data: {world: app.global.world, files: saveFiles} };
      if (!saveLoc) saves.push( save ) // Push into the saves or into an empty array.

      saveLoc = save;
      localStorage.saves = JSON.stringify(saves);

      app.saveLoad.call('save', saveFiles)
      return resolve(saveFiles)
    })
  }

  /**
   * Loads the tracker back to a save file's state.
   * @param {*} name
   * @returns {Promise<Object>}
   */
  static async Load (name) {
    return new Promise((resolve, reject) => {
      const file = JSON.parse(localStorage.saves).find((save) => save.name === name).data
      
      if (!file || !file.files[0]) return reject(new Error('No save file found.'))
      
      GameManager.SetSelectedGame(file.files[0].game); // Set the game to the one in the save file.

      // Make the world cache and set necessary settings.
      app.makeWorlds(file.files.length);
      app.local.world = app.worlds[app.global.world]
      app.global = Object.assign(app.global, { world: file.world, entrances: file.files[0].entrances || [] });

      file.files.forEach((world, index) => {
        Object.assign(app.worlds[index], world) // Reassign the world to the current world.

        app.global.settings = new SettingsManager(world.settings)
        app.worlds[index].items = new ItemManager(app.worlds[index])
        app.worlds[index].items.Set(world.items)
        app.worlds[index].locations = new LocationManager(app.worlds[index])
        app.worlds[index].locations.Set(world.locations)
      })

      app.saveLoad.call('load', file)
      return resolve(file)
    })
  }
}

app.networking = new NetworkManager(app)

export default app
