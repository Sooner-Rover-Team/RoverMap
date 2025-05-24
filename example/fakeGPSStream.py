import asyncio
from aioquic.asyncio.server import serve
from aioquic.asyncio import QuicConnectionProtocol
from aioquic.quic.configuration import QuicConfiguration
import random
from pathlib import Path

class SimpleGPSProtocol(QuicConnectionProtocol):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.running = False
    
    def stream_opened(self, stream_id):
        self.running = True
        asyncio.create_task(self.send_fake_gps())

    async def send_fake_gps(self):
        while self.running:
            latitude = 38.4375 + random.randint(0, 100) / 10000
            longitude = -110.8125 + random.randint(0, 100) / 10000
            gps_data = f"{latitude},{longitude}".encode()
            self._quic_send_datagram(gps_data)
            await self.transmit()
            await asyncio.sleep(1)

async def main():
        config = QuicConfiguration(is_client=False)

        base_path = Path(__file__).parent.parent
        cert_path = base_path / 'cert.pem'
        key_path = base_path / 'key.pem'
        config.load_cert_chain(certfile=str(cert_path), keyfile=str(key_path))

        await serve(
            "0.0.0.0",
            4433,
            configuration=config,
            create_protocol=SimpleGPSProtocol
        )

if __name__ == "__main__":
    asyncio.run(main())