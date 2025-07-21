use crate::{http::{HttpResponse, RequestContext}, services::{auth_service::AuthService, apartment_service::ApartmentService, realty_service::RealtyService, siwe_service::SiweService}, logger};
mod auth;
mod apartment;
mod realty;
use diesel::pg::PgConnection;

pub async fn handle_routes(
    first_line: &str,
    request: &str,
    auth_service: &mut AuthService,
    siwe_service: &SiweService,
    conn: &mut PgConnection,
) -> HttpResponse {
    let apartment_service = ApartmentService::new();
    let realty_service = RealtyService::new();
    
    let mut ctx = match RequestContext::new(first_line, request, None) {
        Some(c) => c,
        None => return HttpResponse::bad_request("Invalid request format"),
    };

    if ctx.method == "OPTIONS" {
        return HttpResponse::new(204, "No Content", None)
            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            .header("Access-Control-Max-Age", "86400"); 
    }
    
    logger::debug(&format!("Handling request: {}", first_line.to_string()));
    let resp = match true {
        _ if ctx.match_route("POST", "/siwe/generate") => auth::handle_siwe_generate(&ctx, siwe_service).await,
        _ if ctx.match_route("POST", "/siwe/login") => auth::handle_siwe_login(conn, &ctx, auth_service, siwe_service).await,
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
        _ if ctx.match_route("PUT", "/user") => auth::handle_update_user(conn, &ctx, auth_service).await,
        _ if ctx.match_route("DELETE", "/user") => auth::handle_delete_user(conn, &ctx, auth_service).await,
        
        // Routes realty
        _ if ctx.match_route("POST", "/realty") => realty::handle_create_realty(conn, &ctx, &realty_service).await,
        _ if ctx.match_route("GET", "/realty/:id") => realty::handle_get_realty(conn, &ctx, &realty_service).await,
        _ if ctx.match_route("GET", "/realty") => realty::handle_get_all_realties(conn, &ctx, &realty_service).await,
        _ if ctx.match_route("PUT", "/realty/:id") => realty::handle_update_realty(conn, &ctx, &realty_service).await,
        _ if ctx.match_route("DELETE", "/realty/:id") => realty::handle_delete_realty(conn, &ctx, &realty_service).await,
        _ if ctx.match_route("GET", "/realty/search") => realty::handle_search_realties(conn, &ctx, &realty_service).await,
        
        // Routes appartements
        _ if ctx.match_route("POST", "/apartments") => apartment::handle_create_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/apartments/:id") => apartment::handle_get_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/apartments") => apartment::handle_get_all_apartments(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("GET", "/realty/:realty_id/apartments") => apartment::handle_get_apartments_by_realty(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("PUT", "/apartments/:id") => apartment::handle_update_apartment(conn, &ctx, &apartment_service).await,
        _ if ctx.match_route("DELETE", "/apartments/:id") => apartment::handle_delete_apartment(conn, &ctx, &apartment_service).await,
        
        _ => {
            logger::warning("Route non reconnue");
            HttpResponse::not_found()
        }
    }
}
