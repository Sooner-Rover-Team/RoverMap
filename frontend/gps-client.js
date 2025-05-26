export function startGPSClient() {
    const url = 'https://localhost:4433';
    const transport = new WebTransport(url);

    transport.ready
        .then(async () => {
            console.log('✅ Connected to GPS server');

            const streamReader = transport.incomingUnidirectionalStreams.getReader();

            while (true) {
                const { value: stream, done } = await streamReader.read();
                if (done || !stream) break;

                const reader = stream.getReader();
                const decoder = new TextDecoder();
                let message = "";

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    message += decoder.decode(value, { stream: true });
                }

                console.log('📡 Received GPS data:', message);

                // Example: assume message is "LAT:12.34,LON:56.78"
                const match = message.match(/LAT:([-\d.]+),LON:([-\d.]+)/);
                if (match) {
                    const lat = parseFloat(match[1]);
                    const lon = parseFloat(match[2]);

                    // Dispatch custom event to main.js
                    window.dispatchEvent(new CustomEvent('gps-update', {
                        detail: { lat, lon }
                    }));
                } else {
                    console.warn("⚠️ Malformed GPS data:", message);
                }
            }
        })
        .catch(error => {
            console.error('❌ Failed to connect via WebTransport:', error);
        });

    return transport; // In case caller wants to close it later
}
