<div align="center">
  <img width="128" src="https://github.com/OOT-Multiworld-Tracker/Multiworld-Tracker/blob/master/public/images/icon.png" /><br /><br />
  <p><i>An advanced auto-tracking Ocarina of Time <b>Multiworld and Singleworld</b> tracker!</i></p>
  <a href="https://github.com/OOT-Multiworld-Tracker/Multiworld-Tracker/actions"><img src="https://github.com/OOT-Multiworld-Tracker/Multiworld-Tracker/actions/workflows/webpack.yml/badge.svg?branch=master" /></a>
  <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/606926504424767488?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
</div>

## About
This tracker is a fully-featured multiworld tracker, equipped with all of the options and play-styles desirable for your run!
- Single and Multiworld Item/Chest ***Autotracking***
- Customizable spoiler-log visibility.
- Key-word based search system (e.g Ocarina Saria)
- View the progress of the other worlds directly within the tracker.

Upon uploading a spoiler log, you can see any locations associated with *your* world in other worlds. This allows you to get a general idea of your potential progression options. The spoiler-log information is limited the world's currently accessible locations, so you won't get over spoiled.

## Installation
For standard usage; the latest version of the application can installed to a native windows application using the installer from the [releases](https://github.com/OOT-Multiworld-Tracker/Multiworld-Tracker/releases). After installed, you can open it from the shortcut on your desktop or via the Windows start menu.

No additional setup needed! Just install and play! For autotracking and networking, you must be using [Modloader64](https://modloader64.org) alongside the plugin.

## Contributions
This tracker is completely open-source along with the plugin associated with it - so please contribute if you'd like! I'm always looking for outside views on UX and feature sets. If you wish to contribute to the software, feel free! The package.json is equipped with everything you need to get started!

### Cloning and building

```bash
git clone https://github.com/OOT-Multiworld-Tracker/Multiworld-Tracker .
npm install
npm run dev # To build & run the tracker.
```

## Package commands
The package.json is equipped with a few commands to make your development life slightly easier. The list of avaliable commands are below.

```bash
npm run dev # Build and run in a development environment - Full access to console logging.
npm run test # Build and run in a production enviroment - Optimized but with a highly reduced error footprint.
```
