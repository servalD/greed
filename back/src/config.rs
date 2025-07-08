use std::env;

use crate::utils::logger;

#[derive(Clone)]
pub struct Config {
    pub jwt_secret: String,
    pub jwt_expiration: u64, // en secondes
    pub jwt_check: u64, // en secondes (the underlying calculated variable is an u16)
    pub refresh_token_expiration: u64, // en secondes
}

impl Config {
    pub fn from_env() -> Self {
        let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET doit être défini");
        let jwt_expiration = env::var("JWT_EXPIRATION")
            .unwrap_or_else(|_| "900".to_string())// 15 minutes
            .parse()
            .expect("JWT_EXPIRATION doit être un nombre");
        let refresh_token_expiration = env::var("REFRESH_TOKEN_EXPIRATION")
            .unwrap_or_else(|_| "604800".to_string())// 7 jours
            .parse()
            .expect("REFRESH_TOKEN_EXPIRATION doit être un nombre");
        let jwt_check = env::var("JWT_CHECK")
            .unwrap_or_else(|_| "180".to_string())// 3 minutes (Check si le refresh token associé a été révoqué)
            .parse()
            .expect("JWT_CHECK doit être un nombre inférieur à 65536");// 2^16 (u16) car c'est pour limiter la ram si du monde ce connecte (ne pas aller trop a l'encontre du principe du JWT...)
        logger::debug(&format!("Configuration : JWT_EXPIRATION: {}, REFRESH_TOKEN_EXPIRATION: {}, JWT_CHECK: {}",
            jwt_expiration, refresh_token_expiration, jwt_check));
        Self { jwt_secret, jwt_expiration, jwt_check, refresh_token_expiration }
    }
}
