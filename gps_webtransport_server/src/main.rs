use s2n_quic::Server;
use std::{error::Error, path::PathBuf, time::Duration};
use rand::Rng;
use tokio::time;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Locate cert and key
    let base_path = std::env::current_dir()?.parent().unwrap().to_path_buf();
    let cert_path: PathBuf = base_path.join("cert.pem");
    let key_path: PathBuf = base_path.join("key.pem");

    // Start QUIC server directly with cert and key
    let mut server = Server::builder()
        .with_tls(cert_path, key_path)?
        .with_io("0.0.0.0:4433")?
        .start()?;

    println!("✅ QUIC GPS server running on https://localhost:4433");

    while let Some(mut conn) = server.accept().await {
        println!("🔗 Connection accepted");

        tokio::spawn(async move {
            let datagram_sender = conn.datagrams();

            loop {
                let mut rng = rand::thread_rng();
                let lat = 38.4375 + rng.gen_range(0.0..0.01);
                let lon = -110.8125 + rng.gen_range(0.0..0.01);
                let data = format!("{:.6},{:.6}", lat, lon);

                if let Err(e) = datagram_sender.send(data.as_bytes()).await {
                    eprintln!("❌ Error sending datagram: {:?}", e);
                    break;
                }

                time::sleep(Duration::from_secs(1)).await;
            }
        });
    }

    Ok(())
}
