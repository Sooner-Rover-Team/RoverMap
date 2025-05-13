import { ACTIVE_BUTTON_TEXT, INACTIVE_BUTTON_TEXT } from './constants.js';

// UI Helpers
export const toggleActivateButton = (button, active) => {
    if (active) {
        button.textContent = ACTIVE_BUTTON_TEXT;
        button.classList.remove("deactivated-tool-button");
        button.classList.add("activated-tool-button");
    } else {
        button.textContent = INACTIVE_BUTTON_TEXT;
        button.classList.remove("activated-tool-button");
        button.classList.add("deactivated-tool-button");
    }
};

// Other Tools
export const degMinSecToDecimal = (deg, min, sec) => {
    return deg + (min / 60) + (sec / 3600);
};

export const degDecimalMinToDecimal = (deg, min) => {
    return deg + (min / 60);
};

export const updateConversionsBasedOn = (el) => {
    const sources = {
        "DMS": ["DMSDeg", "DMSMin", "DMSSec"],
        "DDM": ["DDMDeg", "DDMMin"],
        "Decimal": ["Decimal"]
    };

    let source = "DMS";
    if (el.id.includes("DDM")) source = "DDM";
    else if (el.id.includes("Decimal")) source = "Decimal";

    let sourceValues = sources[source].map(id =>
        parseFloat(document.getElementById(id)?.value) || 0
    );

    let DMSValues = [];
    let DDMValues = [];
    let DecimalValue = 0;

    if (source === "DMS") {
        DMSValues = sourceValues;
        DecimalValue = degMinSecToDecimal(...sourceValues);
    } else if (source === "DDM") {
        DDMValues = sourceValues;
        DecimalValue = degDecimalMinToDecimal(...sourceValues);
    } else if (source === "Decimal") {
        DecimalValue = sourceValues[0];
    }

    document.getElementById("DMSDeg").value = DMSValues[0] || "";
    document.getElementById("DMSMin").value = DMSValues[1] || "";
    document.getElementById("DMSSec").value = DMSValues[2] || "";

    document.getElementById("DDMDeg").value = DDMValues[0] || "";
    document.getElementById("DDMMin").value = DDMValues[1] || "";

    document.getElementById("Decimal").value = DecimalValue;
};

export const copyCoords = () => {
    const el = document.getElementById("Decimal");
    el.select();
    el.setSelectionRange(0, 9999);
    document.execCommand("copy");

    const saved = document.getElementById("saved");
    saved.innerHTML += `<p>${el.value}</p>`;
};

let open = false;
export const openUnitConverter = () => {
    if (!open) {
        document.getElementById("unitConverter").style.display = "block";
        open = true;
    } else {
        closeUnitConverter();
    }
};

export const closeUnitConverter = () => {
    document.getElementById("unitConverter").style.display = "none";
    open = false;
};

export const typeIndicator = (map, pathMarkers) => {
    const coordinates = prompt("Enter your coordinate in `lat lon` format")?.split(" ");
    if (!coordinates || coordinates.length !== 2) return;

    const lat = parseFloat(coordinates[0]);
    const lng = parseFloat(coordinates[1]);

    const isConfirmed = confirm(`Add indicator at lat: ${lat}, lng: ${lng}?`);
    if (isConfirmed) {
        const marker = L.marker([lat, lng]).addTo(map);
        pathMarkers.push(marker);
    }
};
