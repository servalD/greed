use crate::repositories::{user_repo, refresh_token_repo as rt_repo};
use crate::models::user::{NewUser, NewUserPayload, UpdateUserPayload, UpdateUserData, FindUserPayload, DeleteUserPayload, LoginPayload};
use crate::http::{HttpResponse, extract_payload};
use crate::utils::logger;
use crate::services::auth_service::AuthService;
use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::pg::PgConnection;

pub async fn handle_signup(conn: &mut PgConnection, request: &str) -> HttpResponse {
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
    match user_repo::create_user(conn, &new_user) {
        Ok(_) => HttpResponse::ok(Some("User created".to_string())),
        Err(e) => match e.to_string().as_str() {
            e if e.starts_with("duplicate") => HttpResponse::conflict(),
            _ => HttpResponse::internal_server_error()
        },
    }
}

pub async fn handle_login(conn: &mut PgConnection, request: &str, auth_service: &AuthService) -> HttpResponse {
    logger::debug("Requête de login reçue");

    let payload = match extract_payload::<LoginPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    let user = match user_repo::find_user(conn, None, payload.username.as_deref(), payload.email.as_deref()) {
        Ok(Some(u)) => u,
        Ok(None) => {
            logger::warning("Utilisateur non trouvé");
            return HttpResponse::unauthorized();
        }
        Err(e) => {
            logger::error(&format!("Erreur recherche utilisateur: {}", e));
            return HttpResponse::internal_server_error();
        }
    };

    if !verify(&payload.password, &user.password_hash).unwrap_or(false) {
        logger::warning("Mot de passe invalide");
        return HttpResponse::unauthorized();
    }

    let refresh_token = match auth_service.generate_refresh_token(conn, user.id) {
        Ok(rt) => rt,
        Err(e) => {
            logger::error(&format!("Erreur refresh token: {}", e));
            return HttpResponse::internal_server_error();
        }
    };

    let access_token = match auth_service.generate_token(refresh_token.clone()) {
        Ok(token) => token,
        Err(e) => {
            logger::error(&format!("Erreur token: {}", e));
            return HttpResponse::internal_server_error();
        }
    };

    let json = serde_json::json!({
        "token": access_token,
        "refresh_token": refresh_token.token
    }).to_string();
    HttpResponse::ok(Some(json))
}

pub async fn handle_refresh(conn: &mut PgConnection, request: &str, auth_service: &AuthService) -> HttpResponse {

    // Vérifie le refresh token transmis dans l'Authorization header
    let refresh_token = match auth_service.validate_refresh_token(conn, request) {
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
    }).to_string();

    HttpResponse::ok(Some(json))
}


pub async fn handle_logout(conn: &mut PgConnection, request: &str, auth_service: &AuthService) -> HttpResponse {
    let refresh_token = match auth_service.validate_refresh_token(conn, request) {
        Ok(c) => c,
        Err(_) => return HttpResponse::unauthorized(),
    };

    match rt_repo::revoke_refresh_token(conn, &refresh_token.token) {
        Ok(_) => HttpResponse::ok(Some("Déconnecté".into())),
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_update_user(conn: &mut PgConnection, request: &str) -> HttpResponse {
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
    
    match user_repo::update_user(conn, payload.id, update) {
        Ok(user) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_delete_user(conn: &mut PgConnection, request: &str) -> HttpResponse {
    let payload = match extract_payload::<DeleteUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    match user_repo::delete_user(conn, payload.id) {
        Ok(size) => match size{
            1 => HttpResponse::ok(Some("User deleted".to_string())),
            _ => HttpResponse::not_found(),
        },
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_find_user(conn: &mut PgConnection, request: &str) -> HttpResponse {
    let payload = match extract_payload::<FindUserPayload>(request) {
        Ok(p) => p,
        Err(resp) => return resp,
    };

    match user_repo::find_user(conn, payload.id, payload.username.as_deref(), payload.email.as_deref()) {
        Ok(Some(user)) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(_) => HttpResponse::internal_server_error(),
    }
}

pub async fn handle_get_user(conn: &mut PgConnection, id: i32) -> HttpResponse {
    match user_repo::find_user(conn, Some(id), None, None) {
        Ok(Some(user)) => match user.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(_) => HttpResponse::internal_server_error(),
    }
}
