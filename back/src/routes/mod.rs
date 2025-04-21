use crate::{http::{HttpResponse, RequestContext}, services::auth_service::AuthService, logger};
mod auth;
use diesel::pg::PgConnection;

pub async fn handle_routes(
    first_line: &str,
    request: &str,
    auth_service: &mut AuthService,
    conn: &mut PgConnection,
) -> HttpResponse {
    let mut ctx = match RequestContext::new(first_line, request, None) {
        Some(c) => c,
        None => return HttpResponse::bad_request("Invalid request format"),
    };

    let resp = match true {
        _ if ctx.match_route("POST", "/signup") => auth::handle_signup(conn, &ctx).await,
        _ if ctx.match_route("POST", "/login") => auth::handle_login(conn, &ctx, auth_service).await,
        _ if ctx.match_route("POST", "/refresh") => auth::handle_refresh(conn, &ctx, auth_service).await,
        _ if ctx.match_route("POST", "/logout") => auth::handle_logout(conn, &ctx, auth_service).await,
        _ => HttpResponse::i_am_a_teapot()
    };

    if resp.status_code != 418 {
        return resp;
    }

    ctx.user_id = match auth_service.validate_token(conn, ctx.headers.get("Authorization").unwrap_or(&"".to_string())) {
        Ok(claims) => Some(claims.sub),
        Err(e) => {
            logger::warning(&format!("Erreur d'authentification : {}", e));
            return HttpResponse::unauthorized();
        }
    };

    match true {
        _ if ctx.match_route("GET", "/user") => auth::handle_get_user(conn, &ctx).await,
        _ if ctx.match_route("GET", "/user/:id") => auth::handle_get_user(conn, &ctx).await,
        _ if ctx.match_route("PUT", "/user") => auth::handle_update_user(conn, &ctx).await,
        _ if ctx.match_route("DELETE", "/user") => auth::handle_delete_user(conn, &ctx).await,
        _ => {
            logger::warning("Route non reconnue");
            HttpResponse::not_found()
        }
    }
}
