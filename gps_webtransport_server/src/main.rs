use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:9001").await.unwrap();
    println!("✅ WebSocket server running at ws://localhost:9001");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(async move {
            let ws_stream = accept_async(stream).await.unwrap();
            let (mut write, _) = ws_stream.split();
            //38.4375, -110.8125
            let gps_data = r#"{"lat": 38.4375, "lon": -110.8125}"#;
            write
                .send(tungstenite::Message::Text(gps_data.into()))
                .await
                .unwrap();
        });
    }
}
