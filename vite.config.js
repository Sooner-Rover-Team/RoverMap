// Config file for vite (bundler for npm)
import { defineConfig } from 'vite'
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default defineConfig({
    root: 'frontend',
    server: {
        port: 3000
    }
});
