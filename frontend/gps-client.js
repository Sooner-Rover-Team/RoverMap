export function startGPSClient() {
    console.log("Creating websocket...")
    const socket = new WebSocket('ws://192.168.1.68:9001'); // make sure port matches server port
    console.log("WebSocket created!")
    socket.onopen = () => {
        console.log('🔌 WebSocket connection established');
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log(data);
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
