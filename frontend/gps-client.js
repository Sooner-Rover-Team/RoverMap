export function startGPSClient() {
    const url = 'https://localhost:4433'; // Replace if needed

    const transport = new WebTransport(url);

    transport.ready
        .then(() => {
            console.log('Connected to GPS stream');

            const reader = transport.datagrams.readable.getReader();

            const readLoop = async () => {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const decoded = new TextDecoder().decode(value);
                    const [lat, lon] = decoded.trim().split(',').map(Number);

                    // 🔔 Dispatch a custom event with the data
                    window.dispatchEvent(new CustomEvent('gps-update', {
                        detail: { lat, lon }
                    }));
                }
            };

            readLoop();
        })
        .catch(error => {
            console.error('Error connecting to GPS stream:', error);
        });
}
