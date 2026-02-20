import './index.css';
import L from 'leaflet';
import roverImage from '/images/rover.png';
import roverShadowImage from '/images/rover-shadow.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { map } from './map.js';
import { toggleCircles, clearCircles, circleOnPoint } from './circleTools';
import { toggleMarkers, clearPaths } from './pathTools';
import {
    toggleActivateButton,
    degMinSecToDecimal,
    degDecimalMinToDecimal,
    updateConversionsBasedOn,
    copyCoords,
    openUnitConverter,
    closeUnitConverter,
    addWayPoint,
    removeWayPoint
} from './helpers.js';
import { startGPSClient } from './gps-client.js';  // This now returns the WebSocket

L.Icon.Default.prototype._getIconUrl = function (name) {
    if (name === 'icon') return markerIcon;
    if (name === 'shadow') return markerShadow;
};

// Event listeners
window.toggleCircles = toggleCircles;
window.clearCircles = clearCircles;
window.toggleMarkers = toggleMarkers;
window.clearPaths = clearPaths;
window.toggleActivateButton = toggleActivateButton;
window.degMinSecToDecimal = degDecimalMinToDecimal;
window.degMinSecToDecimal = degMinSecToDecimal;
window.updateConversionsBasedOn = updateConversionsBasedOn;
window.copyCoords = copyCoords;
window.openUnitConverter = openUnitConverter;
window.closeUnitConverter = closeUnitConverter;
window.circleOnPoint = circleOnPoint;

const pathMarkers = [];
let currentPositionMarker = null;


window.onload = () => {
    // Initialize rover icon
    var roverIcon = L.icon({
        iconUrl: roverImage,
        shadowUrl: roverShadowImage,

        iconSize: [30, 30], // size of the icon
        shadowSize: [30, 30], // size of the shadow
        iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
        shadowAnchor: [-2, 1],  // the same for the shadow
        popupAnchor: [50, 50] // point from which the popup should open relative to the iconAnchor
    });

    window.addWayPoint = () => {
        addWayPoint(map, pathMarkers);
    };

    window.removeWayPoint = () => {
        removeWayPoint(map, pathMarkers);
    };

    // Listen for GPS data
    window.addEventListener('gps-update', (e) => {
        const { lat, lon } = e.detail;
        // FOR TESTING: console.log(`📡 GPS Update: Latitude ${lat}, Longitude ${lon}`);

        // Add or update the current position marker
        if (currentPositionMarker) {
            currentPositionMarker.setLatLng([lat, lon]);
        } else {
            currentPositionMarker = L.marker([lat, lon], { icon: roverIcon }).addTo(map);

            map.setView([lat, lon], 15); // Center map around Rover initial position
        }
    });

    const socket = startGPSClient(); // Get the WebSocket instance

    window.addEventListener('beforeunload', () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    });
};
