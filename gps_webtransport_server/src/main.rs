use rand::Rng;
use rand::SeedableRng;
use s2n_quic::Server;
use std::path::Path;
use std::{error::Error, time::Duration};
use tokio::io::AsyncWriteExt;
use tokio::time;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let mut server = Server::builder()
        .with_tls((Path::new("../cert.pem"), Path::new("../key.pem")))?
        .with_io("0.0.0.0:4433")?
        .start()?;

    println!("✅ QUIC GPS stream server running on https://localhost:4433");

    while let Some(mut conn) = server.accept().await {
        println!("🔗 Connection accepted");

        tokio::spawn(async move {
            match conn.open_send_stream().await {
                Ok(mut stream) => {
                    loop {
                        let mut rng = rand::rngs::StdRng::from_entropy();
                        let lat = 38.4375 + rng.gen_range(0.0..0.01);
                        let lon = -110.8125 + rng.gen_range(0.0..0.01);
                        let data = format!("{:.6},{:.6}\n", lat, lon); // add newline to delimit

                        if let Err(e) = stream.write_all(data.as_bytes()).await {
                            eprintln!("❌ Stream write error: {:?}", e);
                            break;
                        }

                        time::sleep(Duration::from_secs(1)).await;
                    }
                }
                Err(e) => {
                    eprintln!("❌ Failed to open stream: {:?}", e);
                }
            }
        });
    }

    Ok(())
}
