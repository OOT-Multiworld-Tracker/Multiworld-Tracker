const fs = require('fs')

if (!fs.existsSync('builder')) {
  fs.mkdirSync('builder')
}

if (!fs.existsSync('builder/app')) {
  fs.mkdirSync('builder/app')
}

CopyDirectory('public') // Copy all of the files into a seperate directory
CopyDirectory('js')

function CopyDirectory (directory) {
  if (!fs.existsSync(`builder/app/${directory}`)) {
    fs.mkdirSync(`builder/app/${directory}`)
  }

  const contents = fs.readdirSync(directory)
  for (const content of contents) {
    if (fs.statSync(`${directory}/${content}`).isDirectory()) {
      CopyDirectory(`${directory}/${content}`)
    } else {
      fs.copyFileSync(`${directory}/${content}`, `builder/app/${directory}/${content}`)
    }
  }
}

fs.copyFileSync('app.js', 'builder/app/app.js')