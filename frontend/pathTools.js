import { map } from './map.js';
import { toggleActivateButton } from './helpers.js';

let pathMarkers = [];
let activeTool = "none";
let polyLine = new L.polyline([], {
    color: 'red', weight: 3, opacity: 0.5, smoothFactor: 1
}).addTo(map);

let markerCreateButton = document.getElementById('toggleMarkerButton');
let pointsList = document.getElementById('pathOutput');

export const toggleMarkers = () => {
    activeTool = (activeTool === 'markerDraw') ? 'none' : 'markerDraw';
    toggleActivateButton(markerCreateButton, activeTool === 'markerDraw');
};

export const clearPaths = () => {
    pathMarkers.forEach(marker => marker.remove());
    pathMarkers = [];
    polyLine.setLatLngs([]);
    pointsList.innerHTML = '<h2>Marker List</h2><p>Empty...</p>';
};

map.on('pointerdown', function (e) {
    if (activeTool === 'markerDraw') {
        let newMarker = new L.marker(e.latlng).addTo(map);
        pathMarkers.push(newMarker);
        polyLine.setLatLngs(pathMarkers.map(m => [m._latlng.lat, m._latlng.lng]));

        pointsList.innerHTML = '<h2>Marker List</h2>';
        pointsList.innerHTML += pathMarkers.map(m => `<p>${m._latlng.lat} ${m._latlng.lng}</p>`).join('');
    }
});
