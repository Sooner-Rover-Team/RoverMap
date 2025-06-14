import { map } from './map.js';
import { toggleActivateButton } from './helpers.js';

let circles = [];
let labels = [];
let selectedCircle = null;
let isResizing = false;
let resizeHandle;
let activeTool = "none";

let circleList = document.getElementById('circleList');
let createCircleButton = document.getElementById('toggleCircleButton');

export const toggleCircles = () => {
    activeTool = (activeTool === 'circleDraw') ? 'none' : 'circleDraw';
    toggleActivateButton(createCircleButton, activeTool === 'circleDraw');
};

export const clearCircles = () => {
    circles.forEach(circle => circle.remove());
    labels.forEach(label => label.remove());
    circles = [];
    labels = [];
    updateCircleList();
};

export function circleOnPoint() {
    const input = prompt("Enter coordinates in `lat lon` format (e.g. 38.4375, -110.8125):")?.trim();
    if (!input) return;

    const [latStr, lonStr] = input.split(/\s+/);
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
        alert("Invalid coordinates. Please enter valid numbers.");
        return;
    }

    const isConfirmed = confirm(`Create a circle at latitude: ${lat}, longitude: ${lon}?`);
    if (!isConfirmed) return;

    const center = L.latLng(lat, lon);
    const circle = L.circle(center, { radius: 20, color: "blue" }).addTo(map);
    circles.push(circle);

    map.setView(center, 17);

    updateCircleList();
}

function updateCircleList() {
    circleList.innerHTML = '<h2>Circle List</h2>';
    circles.forEach((circle, index) => {
        let radius = Math.round(circle.getRadius());
        circleList.innerHTML += `<p>${index + 1}. Radius: ${radius}m<br /> Circumference: ${2 * radius}m</p>`;
    });
}

map.on('mousedown', function (e) {
    if (activeTool !== 'circleDraw') return;
    if (!isResizing) {
        selectedCircle = L.circle(e.latlng, { radius: 20, color: "green" }).addTo(map);
        circles.push(selectedCircle);

        let marker = new L.marker(e.latlng, { opacity: 0 });
        marker.bindTooltip(circles.length + "", {
            permanent: true, className: "circleLabel", direction: 'top', offset: [-15, 20]
        }).addTo(map);
        labels.push(marker);

        isResizing = true;
        resizeHandle = e.latlng;
        map.dragging.disable();
        updateCircleList();
    }
});

map.on('mousemove', function (e) {
    if (isResizing && selectedCircle) {
        let newRadius = resizeHandle.distanceTo(e.latlng);
        selectedCircle.setRadius(newRadius);
        updateCircleList();
    }
});

map.on('mouseup', function () {
    if (isResizing) {
        isResizing = false;
        map.dragging.enable();
        updateCircleList();
    }
});
