use anyhow::Result;
use std::time::Duration;
use tracing::Instrument;
use tracing::{error, info, info_span};
use wtransport::endpoint::IncomingSession;
use wtransport::{Endpoint, Identity, ServerConfig};

#[tokio::main]
async fn main() -> Result<()> {
    init_logging();

    let config = ServerConfig::builder()
        .with_bind_default(4433)
        .with_identity(Identity::load_pemfiles("../localhost.pem", "../localhost-key.pem").await?)
        .keep_alive_interval(Some(Duration::from_secs(3)))
        .build();

    let server = Endpoint::server(config)?;

    info!("✅ WebTransport server ready at https://localhost:4433");

    for id in 0.. {
        let incoming_session = server.accept().await;
        tokio::spawn(handle_connection(incoming_session).instrument(info_span!("Connection", id)));
    }

    Ok(())
}

async fn handle_connection(incoming_session: IncomingSession) {
    let result = handle_connection_impl(incoming_session).await;
    if let Err(e) = result {
        error!("❌ Connection error: {:?}", e);
    }
}

async fn handle_connection_impl(incoming_session: IncomingSession) -> Result<()> {
    info!("Waiting for session request...");

    let session_request = incoming_session.await?;

    info!(
        "New session: Authority: '{}', Path: '{}'",
        session_request.authority(),
        session_request.path()
    );

    let connection = session_request.accept().await?;
    info!("✅ Accepted connection, pushing data to client...");

    // Send a unidirectional stream to the client
    let mut send_stream = connection.open_uni().await?.await?;
    let gps_data = b"LAT: 37.7749, LON: -122.4194\n";
    send_stream.write_all(gps_data).await?;
    send_stream.finish().await?;

    info!("✅ Message sent");

    Ok(())
}

fn init_logging() {
    tracing_subscriber::fmt()
        .with_target(true)
        .with_level(true)
        .init();
}
