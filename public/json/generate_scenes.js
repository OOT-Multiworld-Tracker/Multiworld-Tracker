const { readFileSync, writeFileSync } = require("fs");

const nameFilename = "scene_names.txt";
const outFilename = "scenes.json";

const nameData = readFileSync(nameFilename);

var outData = [];

function titleize(str) {
    return str.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
}

var nameArray = nameData.toString().split("\r\n");

for (var i in nameArray) {
    var name = titleize(nameArray[i]);
    outData.push(
        {
            id: i,
            name
        }
    )
}

writeFileSync(outFilename, JSON.stringify(outData, null, 4));