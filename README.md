# Map Server

This houses both the JS/vite frontend to render the map with the rover's coordinates, the home for generated map tiles, and a fake gps server for testing. For the backend of the map server, see the `auto_ros2` repository.

## Structure

The frontend provides a leafletjs map which draws the rover's position on it.
The map renderer uses map tile image files created using QGIS software and stored locally in the `public` and `dist` folders.

## Installation

To install the project, you need our project management tools...

### Frontend

First, you'll need to grab [a tool called `volta`](https://docs.volta.sh/guide/getting-started) first. You'll only have to do this **once per machine**! :D

- If you're on Windows, open a terminal, then type: `winget install Volta.Volta`
- On macOS or Linux, use: `curl https://get.volta.sh | bash`

After you have that, **close your terminal**. Open a new one and navigate to this directory (`RoverMap`). Then, type: `volta setup && npm i` to set up the project. (if you get an error, restart your computer and try again - it'll refresh your environment variables)

You **MUST** do this when your computer has an internet connection! Otherwise, you're gonna be missing dependencies. **You only need to do it once**.

### OPTIONAL: Fake Backend

We have a "fake backend" which teleports the Rover between some coordinates to show that the map works. You don't need it at competition, so don't worry about installing it.

It's written in Rust, so if you want to use it, you'll need to install Rust on your computer:

- On Windows, you use their included installer. Download their `.exe` file and run it! Press `1`, then [Enter] to start installation. You'll be asked to install "Visual C++ build tools" to complete installation. **NOTE: Visual C++ build tools (the purple one) will take a while - grab a drink or something while it installs**.
- On macOS or Linux, just type: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

Everything you need is now installed!

### Using QGIS to generate map tiles

**1. Generate an osm file using Open Street Maps**
First, you need to generate an osm file using Open Street Maps to ensure the correct extent for the map data.
Our current map uses the following bounds from the old map server:

```javascript
// the lat/lon coords are the center of the map, 10 is the default zoom.
var map = L.map("map").setView([38.4375, -110.8125], 10);

// These are the bounds of the rover team's map region for debugging.
new L.marker([38.4375, -110.8125]).addTo(map);
new L.marker([38.375, -110.75]).addTo(map);
```

Go to [this link](https://www.openstreetmap.org/export#map=13/38.40107/-110.79815) to export an Open Street Map. Set the center as your desired center (in this case 38.4375, -110.8125), and set the bounds for the map as your desired bounds. Once the map has the correct bounds, export as an osm file, and save to your computer.
**2. Import to QGIS**
Download [QGIS](https://qgis.org/download/). Once downloaded, follow [these instructions](https://learnosm.org/en/osm-data/osm-in-qgis/) for importing an osm file. This should allow you to view the map on QGIS.
**3. Add satellite imagery**
Our current map uses Satellite Imagery on QGIS, which you can find instructions for adding to a map [here](https://gis.stackexchange.com/questions/439936/adding-google-satellite-imagery-to-qgis).
**4. Export map tiles**
Once the map looks the way you want it to, follow [these instructions](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DvU4bGCh5khM&ved=2ahUKEwjVz6-KjsSNAxWhGDQIHbdHH0UQwqsBegQIEhAG&usg=AOvVaw0kwEDk3Qe84kvYYel7yQvp) to download the QTiles plugin and export your map as a set of map tiles. When choosing the directory to export your map tiles to, select `RoverMap/frontend/public`.
Once you upload new map tiles, don't forget to change the directory path in `frontend/map.js`. Also, if you want to use the tiles offline, make sure to rebuild the `dist/` folder (see offline instructions).

This project uses `npm` and `vite` to manage package dependencies for Javascript and
Leaflet. To use the map server, make sure to [install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Once npm is installed, go to the frontend directory:
`cd frontend`
and run the following command to install project dependencies:
`npm install`

## Running and Integration

### For Frontend

For online run, you can run `npx vite` to run the server's frontend. (Note: this requires for there to be map tiles in the `public` folder.)

#### Offline Instructions

For offline, first make sure to run `npx vite build` for any new changes before running offline. Then, given that the `dist` folder is properly populated, run `npx serve dist` to serve the frontend offline.

### For Server

The server for this frontend is implemented in the `auto_ros2` repository. For testing purposes, a fake GPS server is set up in `gps_webtransport_server`. To run the fake GPS server, simply run:

```
cd gps_webtransport_server
cargo run
```

When you run this server in combination with the map server, it should generate a fake rover position on the map that alternates between two points.

## Accessing

The server should open to port 5173, so you can access by connecting to `https://localhost:5173/`. When you run `npx vite`, it should give you this link automatically.

## Documentation

This SoRo component is a new candidate for documentation! If you know markdown, and have a good idea about what's going on here, please feel free to [make a new page about it in the docs](https://sooner-rover-team.github.io/soro-documentation/html/new-page-guide.html)! :)
