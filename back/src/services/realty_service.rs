use diesel::PgConnection;
use crate::models::apartment::NewApartment;
use crate::models::realty::{Realty, NewRealty};
use crate::models::user::{Role as User_Role, NewUser};
use crate::repositories::realty_repo as repo;
use crate::repositories::user_repo;
use crate::services::apartment_service::ApartmentService;
use crate::utils::logger;

#[derive(Clone)]
pub struct RealtyService;

impl RealtyService {
    pub fn new() -> Self {
        Self
    }

    pub fn create(&self, conn: &mut PgConnection, new: NewRealty, apart_service: &ApartmentService) -> Result<Realty, String> {
        self.validate(&new)?;
        let result = repo::create_realty(conn, &new)
            .map_err(|e| {
                logger::error(&format!("Erreur création bien immobilier: {}", e));
                "Erreur lors de la création".to_string()
            });
            match result {
                Ok(realty) => {
                    // Create apartments if apartment_count is greater than 0
                    let promoter = match user_repo::find_user(conn, None, Some(&realty.promoter), None) {
                        Ok(Some(user)) => user.id,
                        _ => {
                            _ = user_repo::create_user(conn, &NewUser{
                                email: None,
                                first_name: None,
                                last_name: None,
                                eth_address: realty.promoter.clone(), 
                                role: User_Role::Client
                            });
                            match user_repo::find_user(conn, None, Some(&realty.promoter), None) {
                                Ok(Some(user)) => user.id,
                                _ => return Err("Erreur lors de la création du promoteur".to_string()),
                            }
                        },
                    };
                    if new.apartment_count > 0 {
                        let apartments = apart_service.create_multiple(conn, NewApartment{
                            owner_id: promoter, 
                            realty_id: realty.id,
                            token_id: 0, 
                            name: "Default Apartment".to_string(), 
                            image_url: "default_image_url".to_string(), 
                        }, realty.apartment_count);
                        logger::info(&format!("{} appartements créés pour le bien immobilier {}", apartments.unwrap().len(), realty.id));
                    }
                    Ok(realty)
                },
                Err(e) => Err(e),
            }
        
    }

    pub fn get_by_id(&self, conn: &mut PgConnection, id: i32) -> Result<Option<Realty>, String> {
        repo::find_realty_by_id(conn, id)
            .map_err(|e| {
                logger::error(&format!("Erreur recherche bien immobilier: {}", e));
                "Erreur lors de la recherche".to_string()
            })
    }

    pub fn get_by_user(&self, conn: &mut PgConnection, user_id: i32) -> Result<Vec<Realty>, String> {
        repo::find_realties_by_user_id(conn, user_id)
            .map_err(|e| {
                logger::error(&format!("Erreur recherche par utilisateur: {}", e));
                "Erreur lors de la recherche".to_string()
            })
    }

    pub fn get_all(&self, conn: &mut PgConnection) -> Result<Vec<Realty>, String> {
        repo::find_all_realties(conn)
            .map_err(|e| {
                logger::error(&format!("Erreur récupération biens immobiliers: {}", e));
                "Erreur lors de la récupération".to_string()
            })
    }

    pub fn update(&self, conn: &mut PgConnection, id: i32, updated: NewRealty) -> Result<Realty, String> {
        self.validate(&updated)?;
        repo::update_realty(conn, id, &updated)
            .map_err(|e| {
                logger::error(&format!("Erreur mise à jour bien immobilier: {}", e));
                "Erreur lors de la mise à jour".to_string()
            })
    }

    pub fn delete(&self, conn: &mut PgConnection, id: i32) -> Result<bool, String> {
        repo::delete_realty(conn, id)
            .map(|rows| rows > 0)
            .map_err(|e| {
                logger::error(&format!("Erreur suppression bien immobilier: {}", e));
                "Erreur lors de la suppression".to_string()
            })
    }

    pub fn search(&self, conn: &mut PgConnection, query: &str) -> Result<Vec<Realty>, String> {
        if query.trim().is_empty() {
            return Err("Requête de recherche vide".to_string());
        }
        repo::search_realties(conn, query)
            .map_err(|e| {
                logger::error(&format!("Erreur recherche biens immobiliers: {}", e));
                "Erreur lors de la recherche".to_string()
            })
    }

    pub fn exists(&self, conn: &mut PgConnection, id: i32) -> Result<bool, String> {
        repo::realty_exists(conn, id)
            .map_err(|e| {
                logger::error(&format!("Erreur vérification existence: {}", e));
                "Erreur lors de la vérification".to_string()
            })
    }

    fn validate(&self, realty: &NewRealty) -> Result<(), String> {
        if realty.name.trim().is_empty() {
            return Err("Le nom est requis".to_string());
        }
        if realty.address.trim().is_empty() {
            return Err("L'adresse est requise".to_string());
        }
        Ok(())
    }
}
