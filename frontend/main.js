import './index.css';
import { map } from './map.js';
import { toggleCircles, clearCircles } from './circleTools';
import { toggleMarkers, clearPaths } from './pathTools';
import {
    toggleActivateButton,
    degMinSecToDecimal,
    degDecimalMinToDecimal,
    updateConversionsBasedOn,
    copyCoords,
    openUnitConverter,
    closeUnitConverter,
    addWayPoint
} from './helpers.js';
import { startGPSClient } from './gps-client.js';

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

const pathMarkers = [];
let currentPositionMarker = null;  // Store reference to current position marker

window.onload = () => {
    window.addWayPoint = () => {
        addWayPoint(map, pathMarkers);
    };

    // Listen for GPS data
    window.addEventListener('gps-update', (e) => {
        const { lat, lon } = e.detail;
        console.log(`GPS Update: Latitude: ${lat}, Longitude: ${lon}`);

        if (lat && lon) {
            // Remove previous marker if it exists
            if (currentPositionMarker) {
                map.removeLayer(currentPositionMarker);
            }

            // Add new marker and center map on it
            currentPositionMarker = new L.marker([lat, lon], {
                icon: new L.DivIcon({
                    className: 'gps-marker',
                    html: '<div class="gps-pulse"></div>',
                    iconSize: [20, 20]
                })
            }).addTo(map)
                .bindPopup("Current Position");

            map.setView([lat, lon], map.getZoom());
        }
    });

    // Start the GPS client
    startGPSClient();

    // NOTE: For websockets
    // // Cleanup when page unloads
    // window.addEventListener('beforeunload', () => {
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.close();
    //     }
    // });
};