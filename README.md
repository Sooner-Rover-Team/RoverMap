# Map Server

This houses both the HTML/CSS/JS frontend to render the map with the rover's coordinates,
and the backend server that powers it.

## Structure

The frontend provides a leafletjs map which draws the rover's position on it.
The map renderer uses image files served by `server.py`, and generated by 
the generating program in `RoverMapTileGenerator`.


## Running and Integration

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