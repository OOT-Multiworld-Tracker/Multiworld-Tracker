const { writeFileSync } = require('fs')
const path = require('path')

const locFile = require('./locations.json')
const sceneFile = require('./scenes.json')
const groupFile = require('./scene_groups.json')
const outFile = path.join(__dirname, 'locations.new.json')

const scenes = {};
const locations = [];
parseScenes;

function parseScenes() { for (const scene of sceneFile) { scenes[scene.name] = scene } }

locFile.forEach((location) => {
    if (location.name.startsWith('KF')) {
        if (!location.name.includes('Shop')) location.scene = sceneFile[85].id
        else location.scene = sceneFile[45].id
    } else if (location.name.startsWith("LW")) {
        location.scene = sceneFile[91].id
    } else if (location.name.startsWith("Deku Tree")) {
        location.scene = sceneFile[0].id;
    } else if (location.name.startsWith("Jabu")) {
        location.scene = sceneFile[2].id
    } else if (location.name.startsWith("Dodongo")) {
        location.scene = sceneFile[1].id
    } else if (location.name.startsWith("Bottom of")) {
        location.scene = sceneFile[8].id
    } else if (location.name.startsWith("Forest Temple")) {
        location.scene = sceneFile[3].id
    } else if (location.name.startsWith("Fire Temple")) {
        location.scene = sceneFile[4].id
    } else if (location.name.startsWith("Water Temple")) {
        location.scene = sceneFile[5].id
    } else if (location.name.startsWith("Shadow Temple")) {
        location.scene = sceneFile[7].id
    } else if (location.name.startsWith("Spirit Temple")) {
        location.scene = sceneFile[6].id
    } else if (location.name.startsWith("Ice Cavern")) {
        location.scene = sceneFile[9].id
    } else if (location.name.startsWith("Gerudo Training Grounds")) {
        location.scene = sceneFile[11].id
    } else if (location.name.startsWith("Ganons Castle")) {
        location.scene = sceneFile[13].id
    } else if (location.name.startsWith("Ganons Tower")) {
        location.scene = sceneFile[10].id
    } else if (location.name.startsWith("SFM")) {
        location.scene = sceneFile[86].id
    } else if (location.name.startsWith("HF")) {
        location.scene = sceneFile[81].id
    } else if (location.name.startsWith("Market")) {
        location.group = groupFile[0].id
    } else if (location.name.startsWith("LLR")) {
        location.scene = sceneFile[99].id
    } else if (location.name.startsWith("Kak")) {
        location.scene = sceneFile[82].id
    } else if (location.name.startsWith("Graveyard")) {
        location.scene = sceneFile[83].id
    } else if (location.name.startsWith("DMT")) {
        location.scene = sceneFile[96].id
    } else if (location.name.startsWith("GC")) {
        location.scene = sceneFile[98].id
    } else if (location.name.startsWith("DMC")) {
        location.scene = sceneFile[97].id
    } else if (location.name.startsWith("ZR")) {
        location.scene = sceneFile[84].id
    } else if (location.name.startsWith("ZD")) {
        location.scene = sceneFile[88].id
    } else if (location.name.startsWith("ZF")) {
        location.scene = sceneFile[89].id
    } else if (location.name.startsWith("LH")) {
        location.scene = sceneFile[87].id
    } else if (location.name.startsWith("GV")) {
        location.scene = sceneFile[90].id
    } else if (location.name.startsWith("GF")) {
        location.scene = sceneFile[93].id
    } else if (location.name.startsWith("Wasteland")) {
        location.scene = sceneFile[94].id
    } else if (location.name.startsWith("Colossus")) {
        location.scene = sceneFile[92].id
    }
    locations.push(location)
})

writeFileSync(outFile, JSON.stringify(locations, null, 4))