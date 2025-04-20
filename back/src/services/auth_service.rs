use std::fmt::Error;

use diesel::{PgConnection, QueryResult};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey, TokenData};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

use crate::config::Config;
use crate::models::refresh_token::{NewRefreshToken, RefreshToken};
use crate::repositories::refresh_token_repo as rt_repo;
use crate::utils::logger;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: i32,
    pub exp: usize,
    pub refresh: String,
}

#[derive(Clone)]
pub struct AuthService {
    pub config: Config,
}

impl AuthService {
    pub fn new(config: Config) -> Self {
        Self { config }
    }
// JWT
    pub fn generate_token(&self, refresh_token: RefreshToken) -> Result<String, jsonwebtoken::errors::Error> {
        logger::debug(&format!("Génération du token pour l'utilisateur {}", refresh_token.user_id));
        let expiration = Utc::now()
            .checked_add_signed(Duration::seconds(self.config.jwt_expiration as i64))
            .expect("Erreur lors du calcul d'expiration")
            .timestamp();
        // On utilise le refresh_token pour générer le JWT afin de pouvoir revoquer ce dernier
        let claims = Claims {
            sub: refresh_token.user_id,
            exp: expiration as usize,
            refresh: refresh_token.token,
            
        };
        let result = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.config.jwt_secret.as_ref()),
        );

        match &result {
            Ok(_) => logger::debug(&format!("Token généré avec succès pour {}", refresh_token.user_id)),
            Err(e) => logger::error(&format!("Erreur de génération du token : {}", e)),
        }

        result
    }

    pub fn validate_token(&self, conn: &mut PgConnection, request: &str, check_refresh: bool) -> Result<Claims, &str> {
        logger::debug("Extraction du token JWT");
        let token = match request
            .lines()
            .find(|line| line.starts_with("Authorization: "))
            .and_then(|line| line.strip_prefix("Authorization: Bearer "))
            .map(str::trim) {
                Some(t) if !t.is_empty() => t,
                _ => {
                    logger::warning("Authorization header manquant ou malformé");
                    return Err("Invalid JWT token");
                }
        };
        logger::debug("Validation du token JWT");
        let result = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.config.jwt_secret.as_ref()),
            &Validation::default(),
        );
        result
            .map_err(|e| {
                logger::warning(&format!("Token invalide : {}", e));
                "Invalid JWT token"
            })
            .and_then(|data| {
                if check_refresh {
                    rt_repo::check_refresh_token(conn, &data.claims.refresh)
                        .map(|_| data.claims.clone())
                        .map_err(|e| {
                            logger::warning(&format!("Refresh token invalide : {}", e));
                            "Invalid JWT token"
                        })
                } else {
                    Ok(data.claims.clone())
                }
            })
    }

// Refresh token
    pub fn generate_refresh_token(&self,conn: &mut PgConnection, user_id: i32) -> QueryResult<RefreshToken> {
        let token = uuid::Uuid::new_v4().to_string();
        let expires_at = (Utc::now() + Duration::seconds(self.config.refresh_token_expiration as i64)).naive_utc();

        let new = NewRefreshToken {
            user_id,
            token,
            expires_at,
        };
        rt_repo::store_refresh_token(conn, &new)
    }
    // Les validate/revoke refresh token sont dans le refresh_token_repo car ils sont trop lié à la DB

    pub fn validate_refresh_token(
    &self,
    conn: &mut PgConnection,
    request: &str,
) -> Result<RefreshToken, &str> {
    request
        .lines()
        .find(|l| l.starts_with("Authorization: "))
        .and_then(|l| l.strip_prefix("Authorization: Bearer "))
        .map(str::trim)
        .filter(|t| !t.is_empty())
        .ok_or("Invalid refresh token")
        .and_then(|token| {
            rt_repo::check_refresh_token(conn, token).map_err(|e| {
                logger::warning(&format!("Refresh token invalide : {}", e));
                "Invalid refresh token"
            })
        })
}
}
