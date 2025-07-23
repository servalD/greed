use crate::http::{HttpResponse, RequestContext};
use crate::services::apartment_service::ApartmentService;
use crate::services::realty_service::RealtyService;
use crate::models::realty::NewRealty;
use crate::utils::logger;
use diesel::pg::PgConnection;

pub async fn handle_create_realty(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
    apart_service: &ApartmentService,
) -> HttpResponse {
    let payload = match ctx.parse_body::<NewRealty>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match service.create(conn, payload, apart_service) {
        Ok(realty) => match realty.safe_json() {
            Ok(json) => HttpResponse::created(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur création bien immobilier: {}", e));
            HttpResponse::bad_request(&e)
        }
    }
}

pub async fn handle_get_realty(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    match service.get_by_id(conn, id) {
        Ok(Some(realty)) => match realty.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(e) => {
            logger::error(&format!("Erreur récupération bien immobilier: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_get_realties_by_user(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    let user_id = match ctx.param::<i32>("user_id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID utilisateur invalide"),
    };

    match service.get_by_user(conn, user_id) {
        Ok(realties) => match serialize_realties(realties) {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération biens immobiliers: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_get_all_realties(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    match service.get_all(conn) {
        Ok(realties) => match serialize_realties(realties) {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération biens immobiliers: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_update_realty(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    let payload = match ctx.parse_body::<NewRealty>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match service.update(conn, id, payload) {
        Ok(realty) => match realty.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur mise à jour bien immobilier: {}", e));
            HttpResponse::bad_request(&e)
        }
    }
}

pub async fn handle_delete_realty(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    match service.delete(conn, id) {
        Ok(true) => HttpResponse::ok(Some("Bien immobilier supprimé".to_string())),
        Ok(false) => HttpResponse::not_found(),
        Err(e) => {
            logger::error(&format!("Erreur suppression bien immobilier: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_search_realties(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &RealtyService,
) -> HttpResponse {
    let query = match ctx.query::<String>("q") {
        Some(q) => q,
        None => return HttpResponse::bad_request("Paramètre 'q' requis"),
    };

    match service.search(conn, &query) {
        Ok(realties) => match serialize_realties(realties) {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur recherche biens immobiliers: {}", e));
            HttpResponse::bad_request(&e)
        }
    }
}

fn serialize_realties(realties: Vec<crate::models::realty::Realty>) -> Result<String, serde_json::Error> {
    let safe_realties: Result<Vec<_>, _> = realties.iter()
        .map(|r| r.safe_json())
        .collect();
    
    match safe_realties {
        Ok(json_strings) => {
            let json_array = format!("[{}]", json_strings.join(","));
            Ok(json_array)
        }
        Err(e) => Err(e)
    }
}
