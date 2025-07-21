use crate::http::{HttpResponse, RequestContext};
use crate::models::user::{
    DeleteUserPayload, FindUserPayload, NewUser, UpdateUserData,
    UpdateUserPayload,
};
use crate::repositories::{refresh_token_repo as rt_repo, user_repo};
use crate::services::{auth_service::AuthService, siwe_service::SiweService};
use crate::utils::logger;
use bcrypt::{DEFAULT_COST, hash};
use diesel::pg::PgConnection;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize)]
pub struct SiweGeneratePayload {
    pub eth_address: String,
    pub chain_id: u64,
}

#[derive(Deserialize)]
pub struct SiweSigPayload {
    pub nonce: String,
    pub signature: String,
}

pub async fn handle_refresh(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    auth_service: &AuthService,
) -> HttpResponse {
    // Vérifie le refresh token transmis dans l'Authorization header
    let refresh_token = match auth_service.validate_refresh_token(
        conn,
        ctx.headers.get("Authorization").unwrap_or(&"".to_string()),
    ) {
        Ok(rt) => rt,
        Err(_) => return HttpResponse::unauthorized(),
    };

    // Révoque l'ancien
    let _ = rt_repo::revoke_refresh_token(conn, &refresh_token.token);

    // Génère un nouveau refresh token
    let new_refresh = match auth_service.generate_refresh_token(conn, refresh_token.user_id) {
        Ok(rt) => rt,
        Err(_) => return HttpResponse::internal_server_error(),
    };

    // Génère le nouveau access token JWT
    let new_jwt = match auth_service.generate_token(new_refresh.clone()) {
        Ok(jwt) => jwt,
        Err(_) => return HttpResponse::internal_server_error(),
    };

    let json = serde_json::json!({
        "token": new_jwt,
        "refresh_token": new_refresh.token
    })
    .to_string();

    HttpResponse::ok(Some(json))
}

pub async fn handle_logout(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    auth_service: &AuthService,
) -> HttpResponse {
    let refresh_token = match auth_service.validate_refresh_token(
        conn,
        ctx.headers.get("Authorization").unwrap_or(&"".to_string()),
    ) {
        Ok(c) => c,
        Err(_) => return HttpResponse::unauthorized(),
    };

    match rt_repo::revoke_refresh_token(conn, &refresh_token.token) {
        Ok(_) => HttpResponse::ok(Some("Déconnecté".into())),
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_update_user(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    let payload = match ctx.parse_body::<UpdateUserPayload>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    let update = UpdateUserData {
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        // password_hash: Some("".to_string()),
        eth_address: payload.eth_address,
        role: payload.role,
        // is_setup: true, // Si le mot de passe est valide ou mis à jour, on marque l'utilisateur comme setup
    };

    match user_repo::update_user(conn, payload.id, update) {
        Ok(user) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_delete_user(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    let payload = match ctx.parse_body::<DeleteUserPayload>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match user_repo::delete_user(conn, payload.id) {
        Ok(size) => match size {
            1 => HttpResponse::ok(Some("User deleted".to_string())),
            _ => HttpResponse::not_found(),
        },
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_find_user(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    let payload = match ctx.parse_body::<FindUserPayload>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match user_repo::find_user(
        conn,
        payload.id,
        payload.eth_address.as_deref(),
        payload.email.as_deref(),
    ) {
        Ok(Some(user)) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(_) => HttpResponse::internal_server_error(),
    }
}

#[derive(Serialize, Deserialize)]
pub struct IsSetupResponse {
    pub is_setup: bool,
}

pub async fn handle_get_user(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    let user_id = ctx.param::<i32>("id").or(ctx.user_id);

    match user_repo::find_user(conn, user_id, None, None) {
        Ok(Some(user)) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(_) => HttpResponse::internal_server_error(),
    }
}

/// Génère un message SIWE pour l'authentification
pub async fn handle_siwe_generate(
    ctx: &RequestContext,
    siwe_service: &SiweService,
) -> HttpResponse {
    logger::debug("Requête de génération SIWE reçue");

    let payload = match ctx.parse_body::<SiweGeneratePayload>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    // Configurer les paramètres SIWE
    
    match siwe_service.generate_siwe_nonce(&payload.eth_address, &payload.chain_id.to_string()) {
        Ok(response) => {
            
            let json = serde_json::to_string(&response).unwrap_or_default();
            HttpResponse::ok(Some(json))
        }
        Err(e) => {
            logger::error(&format!("Erreur génération SIWE: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

/// Authentifie l'utilisateur avec SIWE
pub async fn handle_siwe_login(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    auth_service: &AuthService,
    siwe_service: &SiweService,
) -> HttpResponse {
    logger::debug("Requête de login SIWE reçue");

    let payload = match ctx.parse_body::<SiweSigPayload>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    // Valider la signature SIWE
    let eth_address =
        match siwe_service.validate_siwe_signature(&payload.nonce, &payload.signature) {
            Ok(addr) => addr,
            Err(e) => {
                logger::warning(&format!("Signature SIWE invalide: {}", e));
                return HttpResponse::unauthorized();
            }
        };

    // Chercher ou créer l'utilisateur
    let user = match user_repo::find_user(conn, None, Some(&eth_address), None) {
        Ok(Some(u)) => {
            logger::debug(&format!("Utilisateur trouvé: {}", u.id));
            u
        }
        Ok(None) => {
            logger::debug("Création d'un nouvel utilisateur SIWE");
            // Auto-création d'utilisateur avec wallet
            let new_user = NewUser {
                email: None,
                first_name: None,
                last_name: None,
                // password_hash: None,
                eth_address: eth_address.clone(),
                role: crate::models::user::Role::Guest,
            };
            match user_repo::create_user(conn, &new_user) {
                Ok(_) => {
                    logger::debug("Nouvel utilisateur créé");
                    // Récupérer l'utilisateur créé
                    match user_repo::find_user(conn, None, Some(&eth_address), None) {
                        Ok(Some(u)) => u,
                        Ok(None) => return HttpResponse::internal_server_error(),
                        Err(e) => {
                            logger::error(&format!(
                                "Erreur lors de la récupération de l'utilisateur créé: {}",
                                e
                            ));
                            return HttpResponse::internal_server_error();
                        }
                    }
                }
                Err(e) => {
                    logger::error(&format!(
                        "Erreur lors de la création de l'utilisateur: {}",
                        e
                    ));
                    return HttpResponse::internal_server_error();
                }
            }
        }
        Err(e) => {
            logger::error(&format!(
                "Erreur lors de la recherche de l'utilisateur: {}",
                e
            ));
            return HttpResponse::internal_server_error();
        }
    };

    let refresh_token = match auth_service.generate_refresh_token(conn, user.id) {
        Ok(rt) => rt,
        Err(e) => {
            logger::error(&format!(
                "Erreur lors de la génération du refresh token: {}",
                e
            ));
            return HttpResponse::internal_server_error();
        }
    };

    let access_token = match auth_service.generate_token(refresh_token.clone()) {
        Ok(token) => token,
        Err(e) => {
            logger::error(&format!("Erreur lors de la génération du token: {}", e));
            return HttpResponse::internal_server_error();
        }
    };

    let user_json = match user.safe_json() {
        Ok(json) => json,
        Err(_) => "{}".to_string(),
    };

    let json = serde_json::json!({
        "token": access_token,
        "refresh_token": refresh_token.token,
        "user": serde_json::from_str::<serde_json::Value>(&user_json).unwrap_or(serde_json::json!({}))
    }).to_string();

    logger::debug(&format!("Login SIWE réussi pour l'utilisateur {}", user.id));
    HttpResponse::ok(Some(json))
}

pub async fn handle_get_guests(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    match user_repo::find_users_by_role(conn, crate::models::user::Role::Guest) {
        Ok(users) => {
            let safe_users: Result<Vec<String>, _> = users.iter()
                .map(|user| user.safe_json())
                .collect();
            
            match safe_users {
                Ok(json_strings) => {
                    let json_array = format!("[{}]", json_strings.join(","));
                    HttpResponse::ok(Some(json_array))
                },
                Err(_) => HttpResponse::internal_server_error(),
            }
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération invités: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_get_clients(conn: &mut PgConnection, ctx: &RequestContext) -> HttpResponse {
    match user_repo::find_users_by_role(conn, crate::models::user::Role::Client) {
        Ok(users) => {
            let safe_users: Result<Vec<String>, _> = users.iter()
                .map(|user| user.safe_json())
                .collect();
            
            match safe_users {
                Ok(json_strings) => {
                    let json_array = format!("[{}]", json_strings.join(","));
                    HttpResponse::ok(Some(json_array))
                },
                Err(_) => HttpResponse::internal_server_error(),
            }
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération clients: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}
