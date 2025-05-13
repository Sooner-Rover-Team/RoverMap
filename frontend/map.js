import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const map = L.map('map').setView([38.4375, -110.8125], 13);

L.tileLayer('/tile/{z}/{x}/{y}', { maxZoom: 19 }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Rover marker polling
// TODO: Implement this. Commented out for now because the output is annoying
let roverMarker = new L.marker([0, 0]).addTo(map);
/*setInterval(() => {
    fetch("/roverCoords").then(res => res.json()).then(data => {
        roverMarker.setLatLng(data)
    });
}, 1000);*/
