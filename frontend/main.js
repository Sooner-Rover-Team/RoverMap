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

const pathMarkers = []

window.onload = () => {
    window.addWayPoint = () => {
        addWayPoint(map, pathMarkers);
    };
};
