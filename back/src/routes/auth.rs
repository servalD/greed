use crate::repositories::user_repo;
use crate::models::user::{NewUser, NewUserPayload, UpdateUserPayload, UpdateUserData, FindUserPayload, DeleteUserPayload, LoginPayload};
use crate::http::{HttpResponse, extract_payload};
use crate::utils::logger;
use crate::services::auth_service::AuthService;
use diesel::pg::PgConnection;
use diesel::Connection;
use std::env;
use bcrypt::{hash, verify, DEFAULT_COST};


fn get_connection() -> Result<PgConnection, HttpResponse> {
    let database_url = env::var("DATABASE_URL").map_err(|_| {
        logger::error("DATABASE_URL non défini dans l'environnement");
        HttpResponse::internal_server_error()
    })?;
    PgConnection::establish(&database_url).map_err(|e| {
        logger::error(&format!("Erreur connexion DB: {}", e));
        HttpResponse::internal_server_error()
    })
}

pub async fn handle_login(request: &str, auth_service: &AuthService) -> HttpResponse {
    logger::debug("Requête de login reçue");

    let payload = match extract_payload::<LoginPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    match get_connection() {
        Ok(mut conn) => match user_repo::find_user(&mut conn, None, payload.username.as_deref(), payload.email.as_deref()) {
            Ok(Some(user)) => {
                if verify(&payload.password, &user.password_hash).unwrap_or(false) {
                    match auth_service.generate_token(user.id) {
                        Ok(token) => {
                            let json = serde_json::json!({ "token": token }).to_string();
                            HttpResponse::ok(Some(json))
                        }
                        Err(e) => {
                            logger::error(&format!("Erreur génération token: {}", e));
                            HttpResponse::internal_server_error()
                        }
                    }
                } else {
                    logger::warning("Mot de passe invalide");
                    HttpResponse::unauthorized()
                }
            }
            Ok(None) => {
                logger::warning("Utilisateur non trouvé");
                HttpResponse::unauthorized()
            }
            Err(e) => {
                logger::error(&format!("Erreur recherche utilisateur: {}", e));
                HttpResponse::internal_server_error()
            }
        },
        Err(resp) => resp,
    }
}

pub async fn handle_signup(request: &str) -> HttpResponse {
    let payload = match extract_payload::<NewUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    let password_hash = match hash(&payload.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(_) => return HttpResponse::internal_server_error(),
    };

    let new_user = NewUser {
        username: payload.username,
        email: payload.email,
        password_hash,
    };

    match get_connection() {
        Ok(mut conn) => match user_repo::create_user(&mut conn, &new_user) {
            Ok(_) => HttpResponse::ok(Some("User created".to_string())),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(resp) => resp,
    }
}

pub async fn handle_update_user(request: &str) -> HttpResponse {
    let payload = match extract_payload::<UpdateUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    let password_hash = match payload.password {
        Some(pw) => match hash(&pw, DEFAULT_COST) {
            Ok(h) => Some(h),
            Err(_) => return HttpResponse::internal_server_error(),
        },
        None => None,
    };

    let update = UpdateUserData {
        username: payload.username,
        email: payload.email,
        password_hash,
    };

    match get_connection() {
        Ok(mut conn) => match user_repo::update_user(&mut conn, payload.id, update) {
            Ok(user) => match user.safe_json() {
                Ok(json) => HttpResponse::ok(Some(json)),
                Err(_) => HttpResponse::internal_server_error(),
            },
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(resp) => resp,
    }
}

pub async fn handle_delete_user(request: &str) -> HttpResponse {
    let payload = match extract_payload::<DeleteUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    match get_connection() {
        Ok(mut conn) => match user_repo::delete_user(&mut conn, payload.id) {
            Ok(_) => HttpResponse::ok(Some("User deleted".to_string())),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(resp) => resp,
    }
}

pub async fn handle_get_user(request: &str) -> HttpResponse {
    let payload = match extract_payload::<FindUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    match get_connection() {
        Ok(mut conn) => match user_repo::find_user(&mut conn, payload.id, payload.username.as_deref(), payload.email.as_deref()) {
            Ok(Some(user)) => match user.safe_json() {
                Ok(json) => HttpResponse::ok(Some(json)),
                Err(_) => HttpResponse::internal_server_error(),
            },
            Ok(None) => HttpResponse::not_found(),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(resp) => resp,
    }
}

pub async fn handle_get_me(user_id: i32) -> HttpResponse {

    match get_connection() {
        Ok(mut conn) => match user_repo::find_user(&mut conn, Some(user_id), None, None) {
            Ok(Some(user)) => match user.safe_json() {
                Ok(json) => HttpResponse::ok(Some(json)),
                Err(_) => HttpResponse::internal_server_error(),
            },
            Ok(None) => HttpResponse::not_found(),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(resp) => resp,
    }
}
