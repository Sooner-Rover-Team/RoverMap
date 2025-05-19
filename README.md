# Map Server

This houses both the HTML/CSS/JS frontend to render the map with the rover's coordinates,
and the backend server that powers it.

## Structure

The frontend provides a leafletjs map which draws the rover's position on it.
The map renderer uses map tile image files created using QGIS software and stored locally in the `public` and `dist` folders.

This project uses `npm` and `vite` to manage package dependencies for Javascript and
Leaflet. To use the map server, make sure to [install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Once npm is installed, go to the frontend directory:
`cd frontend`
and run the following command to install project dependencies:
`npm install`

## Running and Integration

### For Frontend
For online run, you can run `npx vite` to run the server's frontend. (Note: this requires for there to be map tiles in the `public` folder.)

For offline, first make sure to run `npx vite build` for any new changes before 
running offline. Then, given that the `dist` folder is properly populated, run
`npx serve dist` to serve the frontend offline.

### For Server
> (TODO: Figure out if this documentation is still needed)

You can run the server in standalone mode by running `python3 server.py`.

To run it from python, import and call `start_map_server`.
The flask app isn't wrapped nicely in a class (this would be a good refactor),
so we really need to test this integration and make sure it works.

The server sends the rover's gps coords to the web client,
so the server will need to be supplied with those coords.
Call `update_rover_coords` with an array of lat, lng like `[38.4065, -110.79147]`,
the center of the mars thingy.

There's an example in `example/updater.py` to go off of.

## Accessing

The server should open to port 5000, so you can access by connecting to `10.0.0.2:5000`.
That port could change somehow, so you may need to check stdout to find the exact address and port.

## Documentation

This SoRo component is a new candidate for documentation! If you know markdown, and have a good idea about what's going on here, please feel free to [make a new page about it in the docs](https://sooner-rover-team.github.io/soro-documentation/html/new-page-guide.html)! :)
