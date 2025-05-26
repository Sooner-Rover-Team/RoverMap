export function startGPSClient() {
    const socket = new WebSocket('ws://localhost:9001'); // Use your actual WS port

    socket.onopen = () => {
        console.log('🔌 WebSocket connection established');
    }

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const gpsEvent = new CustomEvent('gps-update', { detail: data });
            window.dispatchEvent(gpsEvent);
        } catch (e) {
            console.error('❌ Invalid GPS data:', e);
        }
    };

    socket.onerror = (e) => {
        console.error('❌ WebSocket error:', e);
    };

    socket.onclose = () => {
        console.warn('⚠️ WebSocket connection closed');
    };

    return socket;
}
