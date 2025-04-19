use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey, TokenData};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

use crate::config::Config;
use crate::utils::logger;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32,
    pub exp: usize,
}

#[derive(Clone)]
pub struct AuthService {
    pub config: Config,
}

impl AuthService {
    pub fn new(config: Config) -> Self {
        Self { config }
    }

    pub fn generate_token(&self, user_id: i32) -> Result<String, jsonwebtoken::errors::Error> {
        logger::debug(&format!("Génération du token pour l'utilisateur {}", user_id));
        let expiration = Utc::now()
            .checked_add_signed(Duration::seconds(self.config.jwt_expiration as i64))
            .expect("Erreur lors du calcul d'expiration")
            .timestamp();
        let claims = Claims {
            sub: user_id,
            exp: expiration as usize,
        };
        let result = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.config.jwt_secret.as_ref()),
        );

        match &result {
            Ok(_) => logger::debug(&format!("Token généré avec succès pour {}", user_id)),
            Err(e) => logger::error(&format!("Erreur de génération du token : {}", e)),
        }

        result
    }

    pub fn validate_token(&self, token: &str) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
        logger::debug("Validation du token reçu");
        let result = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.config.jwt_secret.as_ref()),
            &Validation::default(),
        );

        match &result {
            Ok(data) => logger::debug(&format!("Token valide pour l'utilisateur {}", data.claims.sub)),
            Err(e) => logger::warning(&format!("Token invalide : {}", e)),
        }

        result
    }

    pub fn id_from_jwt(
        &self, request: &str
    ) -> Result<i32, &str> {

        let token = request
            .lines()
            .find(|line| line.starts_with("Authorization: "))
            .and_then(|line| line.strip_prefix("Authorization: Bearer "))
            .map(str::trim);

        let token = match token {
            Some(t) if !t.is_empty() => t,
            _ => {
                logger::warning("Authorization header manquant ou malformé");
                return Err("Invalid token");
            }
        };

        match self.validate_token(token) {
            Ok(data) => Ok(data.claims.sub),
            Err(e) => {
                logger::warning(&format!("Token invalide : {}", e));
                Err("Invalid token")
            }
        }
    }
}
