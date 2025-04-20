use crate::{http::HttpResponse, services::auth_service::AuthService, logger};
mod auth;
use diesel::pg::PgConnection;

fn parse_first_line(line: &str) -> Option<(&str, &str)> {
    let mut parts = line.split_whitespace();
    Some((parts.next()?, parts.next()?))
}

pub async fn handle_routes(
    first_line: &str,
    request: &str,
    auth_service: &AuthService,
    conn: &mut PgConnection,
) -> HttpResponse {
    let (method, path) = match parse_first_line(first_line) {
        Some(res) => res,
        None => return HttpResponse::bad_request("Invalid request"),
    };

    let segments: Vec<&str> = path.trim_start_matches('/').split('/').collect();

    // Routes publiques
    match (method, segments.as_slice()) {
        ("POST", ["signup"]) => return auth::handle_signup(conn, request).await,
        ("POST", ["login"]) => return auth::handle_login(conn, request, auth_service).await,
        ("POST", ["refresh"]) => return auth::handle_refresh(conn, request, auth_service).await,
        ("POST", ["logout"]) => return auth::handle_logout(conn, request, auth_service).await,
        _ => {}
    }

    // Routes protégées : valider le JWT une fois
    let user_id = match auth_service.validate_token(conn, request, true) {
        Ok(claims) => claims.sub,
        Err(e) => {
            logger::warning(&format!("Erreur d'authentification : {}", e));
            return HttpResponse::unauthorized();
        }
    };

    // Routes avec JWT
    match (method, segments.as_slice()) {
        ("GET", ["user"]) => auth::handle_get_user(conn, user_id).await,
        ("GET", ["user", id_str]) => match id_str.parse::<i32>() {
            Ok(id) => auth::handle_get_user(conn, id).await,
            Err(_) => HttpResponse::bad_request("Invalid user ID"),
        },
        ("PUT", ["user"]) => auth::handle_update_user(conn, request).await,
        ("DELETE", ["user"]) => auth::handle_delete_user(conn, request).await,
        _ => {
            logger::warning("Route non reconnue");
            HttpResponse::not_found()
        }
    }
}
