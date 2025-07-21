use crate::http::{HttpResponse, RequestContext};
use crate::services::apartment_service::ApartmentService;
use crate::models::apartment::{NewApartment, Apartment};
use crate::utils::logger;
use diesel::pg::PgConnection;

fn serialize_apartments(apartments: Vec<Apartment>) -> Result<String, serde_json::Error> {
    let safe_apartments: Result<Vec<_>, _> = apartments.iter()
        .map(|a| a.safe_json())
        .collect();
    
    match safe_apartments {
        Ok(json_strings) => {
            let json_array = format!("[{}]", json_strings.join(","));
            Ok(json_array)
        }
        Err(e) => Err(e)
    }
}

pub async fn handle_create_apartment(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    let payload = match ctx.parse_body::<NewApartment>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match service.create(conn, payload) {
        Ok(apartment) => match apartment.safe_json() {
            Ok(json) => HttpResponse::created(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur création appartement: {}", e));
            HttpResponse::bad_request(&e)
        }
    }
}

pub async fn handle_get_apartment(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    match service.get_by_id(conn, id) {
        Ok(Some(apartment)) => match apartment.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Ok(None) => HttpResponse::not_found(),
        Err(e) => {
            logger::error(&format!("Erreur récupération appartement: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_get_all_apartments(
    conn: &mut PgConnection,
    _ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    match service.get_all(conn) {
        Ok(apartments) => match serialize_apartments(apartments) {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération appartements: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_get_apartments_by_realty(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    let realty_id = match ctx.param::<i32>("realty_id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID bien immobilier invalide"),
    };

    match service.get_by_realty(conn, realty_id) {
        Ok(apartments) => match serialize_apartments(apartments) {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur récupération appartements: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}

pub async fn handle_update_apartment(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    let payload = match ctx.parse_body::<NewApartment>() {
        Some(p) => p,
        None => return HttpResponse::bad_request("Invalid body format"),
    };

    match service.update(conn, id, payload) {
        Ok(apartment) => match apartment.safe_json() {
            Ok(json) => HttpResponse::ok(Some(json)),
            Err(_) => HttpResponse::internal_server_error(),
        },
        Err(e) => {
            logger::error(&format!("Erreur mise à jour appartement: {}", e));
            HttpResponse::bad_request(&e)
        }
    }
}

pub async fn handle_delete_apartment(
    conn: &mut PgConnection,
    ctx: &RequestContext,
    service: &ApartmentService,
) -> HttpResponse {
    let id = match ctx.param::<i32>("id") {
        Some(id) => id,
        None => return HttpResponse::bad_request("ID invalide"),
    };

    match service.delete(conn, id) {
        Ok(true) => HttpResponse::ok(Some("Appartement supprimé".to_string())),
        Ok(false) => HttpResponse::not_found(),
        Err(e) => {
            logger::error(&format!("Erreur suppression appartement: {}", e));
            HttpResponse::internal_server_error()
        }
    }
}
