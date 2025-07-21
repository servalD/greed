use crate::models::apartment::{Apartment, NewApartment};
use back::schema::apartments::dsl::*;
use diesel::prelude::*;

/// Créer un nouvel appartement
pub fn create_apartment(conn: &mut PgConnection, new: &NewApartment) -> QueryResult<Apartment> {
    diesel::insert_into(apartments).values(new).get_result(conn)
}

/// Trouver un appartement par son ID
pub fn find_apartment_by_id(
    conn: &mut PgConnection,
    apartment_id: i32,
) -> QueryResult<Option<Apartment>> {
    apartments
        .filter(id.eq(apartment_id))
        .first::<Apartment>(conn)
        .optional()
}

/// Trouver tous les appartements d'un bien immobilier
pub fn find_apartments_by_realty_id(
    conn: &mut PgConnection,
    realty_id_val: i32,
) -> QueryResult<Vec<Apartment>> {
    apartments
        .filter(realty_id.eq(realty_id_val))
        .load::<Apartment>(conn)
}

/// Trouver tous les appartements
pub fn find_all_apartments(conn: &mut PgConnection) -> QueryResult<Vec<Apartment>> {
    apartments.load::<Apartment>(conn)
}

/// Mettre à jour un appartement
pub fn update_apartment(
    conn: &mut PgConnection,
    apartment_id: i32,
    updated_apartment: &NewApartment,
) -> QueryResult<Apartment> {
    diesel::update(apartments.filter(id.eq(apartment_id)))
        .set((
            realty_id.eq(&updated_apartment.realty_id),
            name.eq(&updated_apartment.name),
            image_url.eq(&updated_apartment.image_url),
        ))
        .get_result(conn)
}

/// Supprimer un appartement
pub fn delete_apartment(conn: &mut PgConnection, apartment_id: i32) -> QueryResult<usize> {
    diesel::delete(apartments.filter(id.eq(apartment_id))).execute(conn)
}

/// Compter le nombre d'appartements par bien immobilier
pub fn count_apartments_by_realty_id(
    conn: &mut PgConnection,
    realty_id_val: i32,
) -> QueryResult<i64> {
    apartments
        .filter(realty_id.eq(realty_id_val))
        .count()
        .get_result(conn)
}

/// Compter le nombre total d'appartements
pub fn count_all_apartments(conn: &mut PgConnection) -> QueryResult<i64> {
    apartments.count().get_result(conn)
}

/// Vérifier si un appartement existe
pub fn apartment_exists(conn: &mut PgConnection, apartment_id: i32) -> QueryResult<bool> {
    apartments
        .filter(id.eq(apartment_id))
        .count()
        .get_result::<i64>(conn)
        .map(|count| count > 0)
}
