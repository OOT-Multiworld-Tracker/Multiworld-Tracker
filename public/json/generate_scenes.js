const { readFileSync, writeFileSync } = require('fs')

const nameFilename = 'scene_names.txt'
const outFilename = 'scenes.json'

const nameData = readFileSync(nameFilename)

const outData = []

function titleize (str) {
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
}

const nameArray = nameData.toString().split('\r\n')

for (const i in nameArray) {
  const name = titleize(nameArray[i])
  outData.push(
    {
      id: i,
      name
    }
  )
}

writeFileSync(outFilename, JSON.stringify(outData, null, 4))
