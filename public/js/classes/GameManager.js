import { existsSync, mkdirSync, readdirSync, readFile, readFileSync } from "original-fs";

/**
 * @type {Game[]}
 */
var gameList = [];
const multiworldDir = `${process.env.USERPROFILE}\\Documents\\Multi-World\\Games`;
var selectedGame = null;

class Game {
    constructor(data) {
        /**
         * @type {string}
         */
        this.name = data.name;

        /**
         * @type {Location[]}
         */
        this.locations = data.locations;

        this.directory = data.directory;

        this.scenes = data.scenes;

        this.items = data.items;

        this.settings = data.settings;

        this.mixins = data.mixins;

        this.icon = data.icon;
    }
}

export default class GameManager {
    static SetSelectedGame (name) {
        selectedGame = gameList.find(game => game.name === name);
        console.log(selectedGame);
        return this.GetSelectedGame();
    }

    static GetGameDirectory () {
        return multiworldDir;
    }

    static GetGames () {
        return gameList;
    }

    /**
     * 
     * @returns {Game}
     */
    static GetSelectedGame () {
        return selectedGame;    
    }

    static ParseGameList () {
        if (!existsSync(multiworldDir))
            mkdirSync(multiworldDir, { recursive: true });

        const gameListDir = readdirSync(multiworldDir);

        gameListDir.forEach(game => {
            const gameDir = `${multiworldDir}\\${game}`;
            const gameConfig = JSON.parse(readFileSync(gameDir + '\\config.json'));

            const gameName = gameConfig.name;
            const gameLocations = JSON.parse(readFileSync(`${gameDir}/locations.json`)) || [];
            const gameScenes = JSON.parse(readFileSync(`${gameDir}/scenes.json`)) || [];
            const gameIcon = readFileSync(`${gameDir}/icon.png`, 'base64');

            gameList.push(new Game({
                name: gameName,
                locations: gameLocations,
                items: gameConfig.items,
                directory: game,
                settings: gameConfig.settings,
                mixins: gameConfig.mixins,
                scenes: gameScenes,
                icon: gameIcon
            }));
        });

        this.SetSelectedGame(gameList[0].name);
        return gameList;
    }
}

gameList = GameManager.ParseGameList()