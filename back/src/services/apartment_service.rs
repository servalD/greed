use crate::models::apartment::{Apartment, NewApartment};
use crate::repositories::apartment_repo as repo;
use crate::utils::logger;
use diesel::dsl::count;
use diesel::PgConnection;

#[derive(Clone)]
pub struct ApartmentService;

impl ApartmentService {
    pub fn new() -> Self {
        Self
    }

    pub fn create(&self, conn: &mut PgConnection, new: NewApartment) -> Result<Apartment, String> {
        self.validate(&new)?;
        repo::create_apartment(conn, &new).map_err(|e| {
            logger::error(&format!("Erreur création appartement: {}", e));
            "Erreur lors de la création".to_string()
        })
    }

    pub fn create_multiple(
        &self,
        conn: &mut PgConnection,
        new_apartment: NewApartment,
        count: i32,
    ) -> Result<Vec<Apartment>, String> {
        self.validate(&new_apartment)?;
        let mut apartments = Vec::new();
        for i in 0..count {
            let mut app = new_apartment.clone();
            app.token_id = i;
            let apartment = repo::create_apartment(conn, &app).map_err(|e| {
                logger::error(&format!("Erreur création appartement: {}", e));
                "Erreur lors de la création".to_string()
            })?;
            apartments.push(apartment);
        }
        Ok(apartments)
    }

    pub fn get_by_id(&self, conn: &mut PgConnection, id: i32) -> Result<Option<Apartment>, String> {
        repo::find_apartment_by_id(conn, id).map_err(|e| {
            logger::error(&format!("Erreur recherche appartement: {}", e));
            "Erreur lors de la recherche".to_string()
        })
    }

    pub fn get_all(&self, conn: &mut PgConnection) -> Result<Vec<Apartment>, String> {
        repo::find_all_apartments(conn).map_err(|e| {
            logger::error(&format!("Erreur récupération tous appartements: {}", e));
            "Erreur lors de la récupération".to_string()
        })
    }

    pub fn get_by_realty(
        &self,
        conn: &mut PgConnection,
        realty_id: i32,
    ) -> Result<Vec<Apartment>, String> {
        repo::find_apartments_by_realty_id(conn, realty_id).map_err(|e| {
            logger::error(&format!("Erreur recherche par bien: {}", e));
            "Erreur lors de la recherche".to_string()
        })
    }

    pub fn update(
        &self,
        conn: &mut PgConnection,
        id: i32,
        updated: NewApartment,
    ) -> Result<Apartment, String> {
        self.validate(&updated)?;
        repo::update_apartment(conn, id, &updated).map_err(|e| {
            logger::error(&format!("Erreur mise à jour appartement: {}", e));
            "Erreur lors de la mise à jour".to_string()
        })
    }

    pub fn delete(&self, conn: &mut PgConnection, id: i32) -> Result<bool, String> {
        repo::delete_apartment(conn, id)
            .map(|rows| rows > 0)
            .map_err(|e| {
                logger::error(&format!("Erreur suppression appartement: {}", e));
                "Erreur lors de la suppression".to_string()
            })
    }

    fn validate(&self, apartment: &NewApartment) -> Result<(), String> {
        if apartment.name.trim().is_empty() {
            return Err("Le nom est requis".to_string());
        }
        Ok(())
    }
}
