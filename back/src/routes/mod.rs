use crate::{http::{HttpResponse, RequestContext}, services::{auth_service::AuthService, apartment_service::ApartmentService}, logger};
mod auth;
mod apartment;
use diesel::pg::PgConnection;

pub async fn handle_routes(
    first_line: &str,
    request: &str,
    auth_service: &mut AuthService,
    conn: &mut PgConnection,
) -> HttpResponse {
    let apartment_service = ApartmentService::new();
    
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
        
        // Routes appartements
        _ if ctx.match_route("POST", "/apartments") => apartment::handle_create_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/apartments/:id") => apartment::handle_get_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/realty/:realty_id/apartments") => apartment::handle_get_apartments_by_realty(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("PUT", "/apartments/:id") => apartment::handle_update_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("DELETE", "/apartments/:id") => apartment::handle_delete_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/apartments/search") => apartment::handle_search_apartments(conn, &ctx, &apartment_service).await,
        
        _ => {
            logger::warning("Route non reconnue");
            HttpResponse::not_found()
        }
    }
}
