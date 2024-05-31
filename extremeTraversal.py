import threading

from server import MapServer
from libs import Location  # TODO: do some weird shit to use the package

if __name__ == "__main__":
    loc = Location.Location("10.0.0.222", "55556")
    print("Starting GPS")
    loc.start_GPS()
    loc.start_GPS_thread()

    mapServer = MapServer()
    mapServer.register_routes()
    mapServer.start()

    def set_interval(func, sec):
        def func_wrapper():
            set_interval(func, sec)
            func()

        t = threading.Timer(sec, func_wrapper)
        t.start()
        return t

    def update():
        print("sending update...")
        mapServer.update_rover_coords([loc.latitude, loc.longitude])

    set_interval(update, 0.500)
