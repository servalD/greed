use std::env;

#[derive(Clone)]
pub struct Config {
    pub jwt_secret: String,
    pub jwt_expiration: usize, // en secondes
}

impl Config {
    pub fn from_env() -> Self {
        let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET doit être défini");
        let jwt_expiration = env::var("JWT_EXPIRATION")
            .unwrap_or_else(|_| "3600".to_string())
            .parse()
            .expect("JWT_EXPIRATION doit être un nombre");
        Self { jwt_secret, jwt_expiration }
    }
}
