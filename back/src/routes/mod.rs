use crate::{http::HttpResponse, services::auth_service::AuthService, logger};
mod auth;

pub async fn handle_routes(first_line: &str, request: &str, auth_service: &AuthService) -> HttpResponse { 
  // Routes sans login
  let http_response = match first_line {
      req if req.starts_with("POST /signup ") => auth::handle_signup(&request).await,
      req if req.starts_with("POST /login ") => auth::handle_login(&request, &auth_service).await,
      _ => {
          logger::warning("Route non reconnue");
          HttpResponse::i_am_a_teapot()
      }
  };

  if http_response.status_code != 418 {
      return http_response;
  }
  // Routes avec login
  let http_response = match auth_service.id_from_jwt(request){
    Ok(user_id) => match first_line {
      req if req.starts_with("GET /user ") => auth::handle_get_me(user_id).await,
      req if req.starts_with("POST /user ") => auth::handle_get_user(&request).await,
      req if req.starts_with("PUT /user ") => auth::handle_update_user(&request).await,
      req if req.starts_with("DELETE /user ") => auth::handle_delete_user(&request).await,
      _ => {
          logger::warning("Route non reconnue");
          HttpResponse::not_found()
      }
    }
    Err(e) => {
      logger::warning(format!("Erreur d'authentification: {}", e).as_str());
      HttpResponse::unauthorized()
    }
  };
  http_response
}
