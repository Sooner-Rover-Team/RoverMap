use futures_util::{SinkExt, StreamExt};
use tokio::{
    net::TcpListener,
    time::{interval, Duration},
};
use tokio_tungstenite::accept_async;
use tungstenite::Message;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:9001").await.unwrap();
    println!("✅ WebSocket server running at ws://localhost:9001");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(async move {
            let ws_stream = accept_async(stream).await.unwrap();
            let (mut write, _) = ws_stream.split();

            let mut interval = interval(Duration::from_secs(1));
            let mut toggle = true;

            loop {
                interval.tick().await;

                let (lat, lon) = if toggle {
                    (38.4375, -110.8125)
                } else {
                    (38.4380, -110.8130) // Slightly different location
                };
                toggle = !toggle;

                let gps_data = format!(r#"{{"lat": {}, "lon": {}}}"#, lat, lon);
                if let Err(e) = write.send(Message::Text(gps_data.into())).await {
                    eprintln!("❌ WebSocket send error: {}", e);
                    break;
                }
            }
        });
    }
}
