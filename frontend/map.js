import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const map = L.map('map').setView([38.4375, -110.8125], 17);

const tileLayer = L.tileLayer('/utah-tiles-2/{z}/{x}/{y}.png', {
    attribution: 'GE Satellite Data',
    maxZoom: 19,
    minZoom: 13,
    tileSize: 256,
    noWrap: true,
});

tileLayer.on('tileerror', function (e) {
    console.error('Tile failed to load:', {
        url: e.tile.src,
        coords: e.coords,
        error: e.error // could be undefined
    });
});

tileLayer.addTo(map);

console.log(new URL('/utah-tiles-2/17/25188/50355.png', window.location.href).href);
