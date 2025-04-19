mod config;
mod services;
mod routes;
mod utils;
mod http;
mod models;
mod repositories;

use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

use config::Config;
use services::auth_service::AuthService;
use routes::handle_routes;
use utils::logger;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Initialisation des logs
    logger::init_logger(Some("server.log"));
    logger::info("Initialisation du serveur");

    // Lecture de la config
    let config = Config::from_env();
    logger::debug("Configuration chargée depuis l'environnement");

    let auth_service = AuthService::new(config);
    let listener = TcpListener::bind("127.0.0.1:3000").await?;
    logger::info("Serveur écoutant sur 127.0.0.1:3000");

    loop {
        let (mut socket, addr) = listener.accept().await?;
        logger::info(&format!("Connexion entrante depuis {}", addr));
        let auth_service = auth_service.clone();

        tokio::spawn(async move {
            let mut buffer = [0; 1024];
            let n = match socket.read(&mut buffer).await {
                Ok(n) if n == 0 => {
                    logger::debug("Connexion fermée proprement");
                    return;
                }
                Ok(n) => n,
                Err(e) => {
                    logger::error(&format!("Erreur de lecture : {}", e));
                    return;
                }
            };

            let request = String::from_utf8_lossy(&buffer[..n]).to_string();
            let first_line = request.lines().next().unwrap_or("");
            logger::debug(&format!("Requête brute : {}", first_line));

            let response = handle_routes(&first_line, &request, &auth_service).await;

            if let Err(e) = socket.write_all(response.to_string().as_bytes()).await {
                logger::error(&format!("Erreur d'écriture dans le socket : {}", e));
            }
        });
    }
}
