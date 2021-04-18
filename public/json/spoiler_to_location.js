const fs = require('fs')
const file = require('./spoiler.json')

const locations = []

Object.keys(file.locations['World 1']).forEach((entry) => {
  locations.push({ name: entry })
})

fs.writeFileSync('new_locations.json', JSON.stringify(locations, null, 2))
