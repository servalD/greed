use std::collections::HashMap;

use diesel::{PgConnection, QueryResult};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey, get_current_timestamp};
use serde::{Serialize, Deserialize};
use std::sync::{Arc, RwLock};
use chrono::{Utc, Duration};

use crate::config::Config;
use crate::models::refresh_token::{NewRefreshToken, RefreshToken};
use crate::models::user::User;
use crate::repositories::{refresh_token_repo as rt_repo, user_repo};
use crate::utils::logger;
use bcrypt::{verify};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: i32,
    pub exp: u64,
    pub start: u64,
    pub refresh: String,
}

#[derive(Clone)]
pub struct AuthService {
    pub config: Config,
    pub refresh_count: Arc<RwLock<HashMap<i32, u16>>>,
}

impl AuthService {
    pub fn new(config: Config) -> Self {
        Self { config, refresh_count: Arc::new(RwLock::new(HashMap::new())) }
    }
// JWT
    pub fn generate_token(&self, refresh_token: RefreshToken) -> Result<String, jsonwebtoken::errors::Error> {
        logger::debug(&format!("Génération du token pour l'utilisateur {}", refresh_token.user_id));
        let expiration = get_current_timestamp() + self.config.jwt_expiration;
        // On utilise le refresh_token pour générer le JWT afin de pouvoir revoquer ce dernier
        let claims = Claims {
            sub: refresh_token.user_id,
            exp: expiration,
            start: Utc::now().timestamp() as u64,
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

    pub fn validate_token(&mut self, conn: &mut PgConnection, auth: &str) -> Result<Claims, &str> {
        logger::debug("Extraction du token JWT");
        let token = match auth.strip_prefix("Bearer ")
            .map(str::trim) {
                Some(t) if !t.is_empty() => t,
                _ => {
                    logger::warning("Authorization header manquant ou malformé");
                    return Err("Invalid JWT token");
                }
        };
        logger::debug("Validation du token JWT");
        let mut valid = Validation::default();
        valid.validate_exp = true;
        valid.leeway = 0;
        let result = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.config.jwt_secret.as_ref()),
            &valid,
        );
        result
            .map_err(|e| {
                logger::warning(&format!("Token invalide : {}", e));
                "Invalid JWT token"
            })
            .and_then(|data| {
                let last_refresh = self.refresh_count.read().unwrap().get(&data.claims.sub).copied().unwrap_or(0);
                let current_refresh = (((Utc::now().timestamp() as u64) - data.claims.start) / self.config.jwt_check) as u16;
                logger::debug(&format!("Last modulo {}, Current modulo {}", last_refresh, current_refresh));
                if last_refresh != current_refresh {
                    rt_repo::check_refresh_token(conn, &data.claims.refresh)
                        .map(|_| {
                            self.refresh_count.write().unwrap().insert(data.claims.sub, current_refresh);
                            logger::debug(&format!("Token expiration time: {}", Utc::now().timestamp() as u64 - data.claims.start));
                            data.claims.clone()
                        })
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
        auth: &str,
    ) -> Result<RefreshToken, &str> {
        auth.strip_prefix("Bearer ")
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

    pub fn validate_password(
        &self,
        conn: &mut PgConnection,
        user_id: i32,
        password: &str,
    ) -> Result<(User, bool), &str> {
    
        let user = user_repo::find_user(conn, Some(user_id), None, None)
            .map_err(|_| "db error")?
            .ok_or("User not found")?;

        if password.is_empty() {
            return Ok((user, false));
        }

        let hash = match user.password_hash.clone() {
            Some(h) => h,
            None => return Ok((user, false)),
        };

        if verify(password, &hash).map_err(|_| "Verify failed")? {
            Ok((user, true))
        } else {
            Ok((user, false))
        }
    }
}
