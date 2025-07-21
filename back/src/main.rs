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
use services::{auth_service::AuthService, siwe_service::SiweService};
use routes::handle_routes;
use utils::logger;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use std::env;

type PgPool = Pool<ConnectionManager<PgConnection>>;

fn get_db_connection_pool() -> PgPool {
    match env::var("DATABASE_URL"){
        Ok(database_url) => {
            logger::info(&format!("Connexion à la base de données : {}", database_url));
            return Pool::builder()
                .max_size(10)
                .build(ConnectionManager::<PgConnection>::new(database_url))
                .expect("Erreur de connexion à la base de données");
        }
        Err(_) => panic!("DATABASE_URL non défini dans l'environnement")
    }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Initialisation des logs
    logger::init_logger(Some("server.log"));
    logger::info("Initialisation du serveur");

    // Lecture de la config
    let config = Config::from_env();
    logger::debug("Configuration chargée depuis l'environnement");

    let auth_service = AuthService::new(config);
    let siwe_service = SiweService::new();
    let db_pool =  get_db_connection_pool();
    let listener = TcpListener::bind("127.0.0.1:3000").await?;
    logger::info("Serveur écoutant sur 127.0.0.1:3000");
    

    loop {
        let (mut socket, addr) = listener.accept().await?;
        logger::info(&format!("Connexion entrante depuis {}", addr));
        let mut auth_service = auth_service.clone();
        let siwe_service = siwe_service.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            let mut buf = Vec::new();
            let mut temp = [0u8; 1024];

            loop {
                let n = socket.read(&mut temp).await.ok()?; if n == 0 { return None; }
                buf.extend_from_slice(&temp[..n]);

                if let Some(h_end) = buf.windows(4).position(|w| w == b"\r\n\r\n") {
                    let headers = &buf[..h_end + 4];
                    let body_start = h_end + 4;

                    let len = String::from_utf8_lossy(headers)
                        .lines()
                        .find(|l| l.to_ascii_lowercase().starts_with("content-length:"))
                        .and_then(|l| l.split(':').nth(1)?.trim().parse::<usize>().ok())
                        .unwrap_or(0);

                    let missing = len.saturating_sub(buf.len().saturating_sub(body_start));
                    if missing > 0 {
                        let mut rest = vec![0u8; missing];
                        socket.read_exact(&mut rest).await.ok()?;
                        buf.extend(rest);
                    }
                    break;
                }
            }

            let request = String::from_utf8_lossy(&buf).to_string();
            let first_line = request.lines().next().unwrap_or("");
            logger::debug(&format!("Requête brute : {}", first_line));
            let mut conn = db_pool.get().unwrap();
            let response = handle_routes(&first_line, &request, &mut auth_service, &siwe_service, &mut conn).await;

            if let Err(e) = socket.write_all(response.to_string().as_bytes()).await {
                logger::error(&format!("Erreur d'écriture dans le socket : {}", e));
                return None;
            }
            Some(())
        });
    }
}
