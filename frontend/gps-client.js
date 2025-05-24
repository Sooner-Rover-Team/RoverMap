export function startGPSClient() {
    const url = 'https://localhost:4433'; // needs to match the server URL

    const transport = new WebTransport(url);

    transport.ready
        .then(() => {
            console.log('Connected to GPS stream');

            const streamReader = transport.incomingUnidirectionalStreams.getReader();

            const processStream = async (stream) => {
                const textStream = stream.pipeThrough(new TextDecoderStream());
                const reader = textStream.getReader();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    // Value is a line of GPS data
                    const lines = value.trim().split('\n');
                    for (const line of lines) {
                        const [lat, lon] = line.trim().split(',').map(Number);
                        window.dispatchEvent(new CustomEvent('gps-update', {
                            detail: { lat, lon }
                        }));
                    }
                }
            };

            const handleStreams = async () => {
                while (true) {
                    const { value: stream, done } = await streamReader.read();
                    if (done) break;
                    processStream(stream);
                }
            };

            handleStreams();
        })
        .catch(error => {
            console.error('Error connecting to GPS stream:', error);
        });
}
