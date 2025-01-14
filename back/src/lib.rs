pub mod description;
pub mod title;
pub mod status;
pub mod store;
pub mod request;

use std::sync::Arc;
use request::handle_client;
use tokio::{net::TcpListener, task::spawn_blocking};
use tokio::sync::RwLock;

pub async fn rest_server(litener: TcpListener) -> std::io::Result<()>{
  let store = Arc::new(RwLock::new(store::ImageStore::new()));

  loop{
    let (socket, _) = litener.accept().await.unwrap();
    let store = store.clone();
    tokio::spawn(handle_client(socket, store));
  }

}
