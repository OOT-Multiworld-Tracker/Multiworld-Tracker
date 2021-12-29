const { writeFileSync } = require('fs');
const locations = require('./locations.json');

function MakeLogicArray (location) {
    location.logic = location.logic?.split(' ').slice(2) || [];
    const trueLogic = [];

    location.logic.map((logic, index) => {
        if (/(\w+\(\w+\))/.test(logic)) {
            trueLogic.push({
                "type:": "mixin",
                "name": logic.slice(0, logic.indexOf('('))
            })
        }

        if (logic === "||")
            trueLogic.push("||");

        if (logic.startsWith("world.dungeons")) {
            trueLogic.push({
                "type:": "dungeon",
                "index": parseInt(logic.slice(logic.indexOf('[')+1, logic.indexOf(']')))
            })
        }

        if (logic.startsWith("world.items")) {
            console.log(logic)
            trueLogic.push({
                "type:": "item",
                "name": logic.slice(11+1, logic.indexOf('.', 11+1)).replace(/([A-Z])/g, ' $1').trim(),
                "index": parseInt(location.logic[index+2])
            })
        }

        if (logic.startsWith("world.app.global.settings")) {
            trueLogic.push({
                "type:": "setting",
                "name": logic.slice("world.app.global.settings".length+1, logic.indexOf('.', "world.app.global.settings".length+1)).replace(/([A-Z])/g, ' $1').trim()
                .replace(/([A-Z])/g, ' $1').trim(),
                "index": parseInt(location.logic[index+2])
            })
        }
    })

    location.logic = trueLogic;
    writeFileSync("./nlocations.json", JSON.stringify(locations, null, 2));
}

locations.forEach((location) => {   
    MakeLogicArray(location);
})