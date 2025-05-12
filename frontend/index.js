// note: leaflet exports itself as `L` on the html side of things.
// it's pretty bad but they seem to like it... :p

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map = L.map('map').setView([38.4375, -110.8125], 13);


let templateString = '/tile/{z}/{x}/{y}'

console.log(templateString);

L.tileLayer(templateString, {
    maxZoom: 19
}).addTo(map);


// Poll for the rover's position every second
let roverMarker = new L.marker([0, 0]).addTo(map);
setInterval(() => {
    fetch("/roverCoords").then(res => res.json()).then(data => {
        console.log(data);
        roverMarker.setLatLng(data)
    })
}, 1000);


// Add a tile layer for the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


/////////DRAWING TOOLS SECTION/////////
//---------------------------------//

let resizeHandle;
let selectedCircle;

let circles = [];
let lables = [];
let pathMarkers = [];

let activeTool = "none";
let isResizing = false;

const polyLine = new L.polyline(pathMarkers, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
}).addTo(map);

/// Swap's a given button's class to "deactivated-tool-button" and "activated-tool-button".
const toggleActivateButton = (button, active) => {
    console.log("Toggling button `", button.id, "` with activity: ", active);

    if (active) {
        button.textContent = ACTIVE_BUTTON_TEXT;
        button.classList.remove("deactivated-tool-button");
        button.classList.add("activated-tool-button");
    } else {
        button.textContent = INACTIVE_BUTTON_TEXT;
        button.classList.remove("activated-tool-button");
        button.classList.add("deactivated-tool-button");
    }
}

let pointsList = document.getElementById("pathOutput");

map.on('mousedown', function (e) {
    if (activeTool == 'circleDraw') { //Check for toggle 
        if (!isResizing) {
            //Create a new Circle element at the click position
            selectedCircle = L.circle(e.latlng, { radius: 10, draggable: false, color: "green" }).addTo(map);
            circles.push(selectedCircle);

            let marker = new L.marker(e.latlng, { opacity: 0 });
            marker.bindTooltip(circles.length + "", { permanent: true, className: "circleLabel", direction: 'top', offset: [-15, 20] });
            marker.addTo(map);
            lables.push(marker)

            isResizing = true;
            //Move circle to mouse positon
            resizeHandle = e.latlng;
            map.dragging.disable(); // Disable map dragging

            updateCircleList();
        }
    } else if (activeTool == 'markerDraw') {
        let newMarker = new L.marker(e.latlng).addTo(map);
        pathMarkers.push(newMarker)
        console.log("lats",);
        polyLine.setLatLngs(pathMarkers.map(e => [e._latlng.lat, e._latlng.lng]))
        pointsList.innerHTML = '<h2>Marker List</h2>';
        pointsList.innerHTML += ('<p>' + (pathMarkers.map(e => `${e._latlng.lat} ${e._latlng.lng}`).join("<br>")) + '</p>');

    }
});

//Start resizing
map.on('mousemove', function (e) {
    if (isResizing) {
        //Creates a new radius of the distance between the mouse and the center of the active circle
        let newRadius = resizeHandle.distanceTo(e.latlng);
        updateCircleList();
        selectedCircle.setRadius(newRadius); //Update radius
        // resizeMarker.setLatLng(selectedCircle.getLatLng()); //Update position
    }
});

//End resizing
map.on('mouseup', function () {
    if (isResizing) {
        isResizing = false;
        updateCircleList();
        map.dragging.enable(); // Enable map dragging
    }
});

//Update the radius list
let circleList = document.getElementById('circleList');
const updateCircleList = () => {
    circleList.innerHTML = '<h2>Circle List</h2>';
    circles.forEach(function (circle, index) {
        let radius = Math.round(circle.getRadius());
        circleList.innerHTML += '<p> '
            + (index + 1) + '. Radius: ' + radius +
            'm<br /> Circumference: ' + 2 * radius + 'm</p>';
    });
}

let createCircleButton = document.getElementById('toggleCircleButton');
let markerCreateButton = document.getElementById('toggleMarkerButton');

const ACTIVE_BUTTON_TEXT = "ACTIVE";
const INACTIVE_BUTTON_TEXT = "INACTIVE";

const toggleCircles = () => {
    // change the active tool
    if (activeTool == 'circleDraw') {
        activeTool = 'none'
    } else {
        activeTool = 'circleDraw';
    }

    toggleActivateButton(createCircleButton, activeTool == 'circleDraw');
}
const toggleMarkers = () => {
    // change the active tool
    if (activeTool == 'markerDraw') {
        activeTool = 'none'
    } else {
        activeTool = 'markerDraw';
    }

    toggleActivateButton(markerCreateButton, activeTool == 'markerDraw');
}
const clearCircles = () => {
    circles.forEach(function (circle) {
        circle.remove();
    });
    lables.forEach(function (label) {
        label.remove();
    });
    circles = []
    lables = []
    updateCircleList()
}
const clearPaths = () => {
    pathMarkers.forEach(function (marker) {
        marker.remove();
    });
    pathMarkers = []
    updateCircleList()
}



/////////OTHER TOOLS SECTION/////////
//---------------------------------//
const typeIndicator = () => {
    const coordinates = prompt("Enter your coordinate in `lat lon` format").split(" ");
    console.log("Adding human reference point at `", coordinates, "`...");
    const lat = parseFloat(coordinates[0]);
    const lng = parseFloat(coordinates[1]);
    pathMarkers.push(new L.Marker([lat, lng]).addTo(map));

    let isConfirmed = confirm(`Add indicator at lng: ${coordinates[0]}, lat: ${coordinates[1]}?`);
    if (isConfirmed) {
        let marker = new L.marker(coordinates).addTo(map);
    }
}


const degMinSecToDecimal = (deg, min, sec) => {
    console.log("Converting:", deg, min, sec)
    console.log("Returning", (deg + (min / 60) + (sec / 3600)))
    return deg + (min / 60) + (sec / 3600);
}

const degDecimalMinToDecimal = (deg, min) => {
    return deg + (min / 60)
}

let open = false;

const openUnitConverter = () => {
    if (!open) {
        document.getElementById("unitConverter").style.display = "block";
        open = true;
    } else {
        closeUnitConverter();
    }

}
const closeUnitConverter = () => {
    document.getElementById("unitConverter").style.display = "none";
    open = false;
}

const updateConversionsBasedOn = (el) => {
    let sources = {
        "DMS": ["DMSDeg", "DMSMin", "DMSSec"],
        "DDM": ["DDMDeg", "DDMMin"],
        "Decimal": ["Decimal"]
    }

    let source = "DMS";
    if (el.id.indexOf("DMS") !== -1) source = "DMS"
    else if (el.id.indexOf("DDM") !== -1) source = "DDM"
    else if (el.id.indexOf("Decimal") !== -1) source = "Decimal";

    let sourceValues = [];
    for (let id of sources[source]) {
        console.log(document.getElementById(id))
        sourceValues.push(parseFloat(document.getElementById(id).value) || 0);
    }
    console.log("Source", sourceValues)

    let DMSValues = [];
    let DDMValues = [];
    let DecimalValue = 0;

    if (source === "DMS") {
        DMSValues = sourceValues;
        DecimalValue = degMinSecToDecimal(...sourceValues);
        console.log("Converted successfully: ", DecimalValue)
    } else if (source === "DDM") {
        DDMValues = sourceValues;
        DecimalValue = degDecimalMinToDecimal(...sourceValues);
        console.log("DDM convert", degDecimalMinToDecimal(...sourceValues))
    } else if (source === "Decimal") {
        DecimalValue = sourceValues;
    }

    console.log(DMSValues, DDMValues, DecimalValue)

    document.getElementById("DMSDeg").value = DMSValues[0] || "";
    document.getElementById("DMSMin").value = DMSValues[1] || "";
    document.getElementById("DMSSec").value = DMSValues[2] || "";

    document.getElementById("DDMDeg").value = DDMValues[0] || "";
    document.getElementById("DDMMin").value = DDMValues[1] || "";

    console.log("What is the problem", DecimalValue)
    document.getElementById("Decimal").value = DecimalValue;

}

Array.from(document.getElementsByClassName("convertInput")).forEach(el => {
    console.log(el)
    el.addEventListener("keyup", function (evt) {
        if (!isNaN(evt.key))
            updateConversionsBasedOn(el);
    });
})


let valuesCopied = [];
const copyCoords = () => {
    let el = document.getElementById("Decimal");
    el.select();
    el.setSelectionRange(0, 9999);
    valuesCopied.push(el.value);
    document.getElementById("saved").innerHTML +=
        `
    <p>${el.value}</p>
    `
    document.execCommand("copy")
}