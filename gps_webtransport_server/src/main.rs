use anyhow::Result;
use rand::Rng;
use tokio::time::{sleep, Duration};
use wtransport::{Endpoint, Identity, ServerConfig};

#[tokio::main]
async fn main() -> Result<()> {
    let config = ServerConfig::builder()
        .with_bind_default(4433)
        .with_identity(Identity::load_pemfiles("../cert.pem", "../key.pem").await?)
        .build();

    let server = Endpoint::server(config)?;

    println!("✅ WebTransport GPS server running on https://localhost:4433");

    loop {
        let incoming_session = server.accept().await;
        let incoming_request = incoming_session.await?;
        let connection = incoming_request.accept().await?;

        println!("🔗 New client connected");

        tokio::spawn(async move {
            loop {
                // Scope the RNG inside this block so it's dropped before any `.await`
                let gps_str = {
                    let mut rand = rand::rng(); // or `fastrand::rng()` if that's your custom fn
                    let lat = 38.4375 + rand.random_range(0.0..0.01);
                    let lon = -110.8125 + rand.random_range(0.0..0.01);
                    format!("{:.6},{:.6}", lat, lon)
                };

                if let Err(e) = connection.send_datagram(gps_str.into_bytes()) {
                    eprintln!("❌ Failed to send datagram: {:?}", e);
                    break;
                }

                sleep(Duration::from_secs(1)).await;
            }

            println!("❌ Client disconnected or datagram error");
        });
    }
}
