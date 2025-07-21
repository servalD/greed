use diesel::prelude::*;
use crate::models::realty::{Realty, NewRealty};
use back::schema::realties::dsl::*;

/// Créer un nouveau bien immobilier
pub fn create_realty(conn: &mut PgConnection, new: &NewRealty) -> QueryResult<Realty> {
    diesel::insert_into(realties)
        .values(new)
        .get_result(conn)
}

/// Trouver un bien immobilier par son ID
pub fn find_realty_by_id(conn: &mut PgConnection, realty_id: i32) -> QueryResult<Option<Realty>> {
    realties
        .filter(id.eq(realty_id))
        .first::<Realty>(conn)
        .optional()
}

/// Trouver tous les biens immobiliers d'un utilisateur
pub fn find_realties_by_user_id(conn: &mut PgConnection, user_id_val: i32) -> QueryResult<Vec<Realty>> {
    realties
        .filter(user_id.eq(user_id_val))
        .load::<Realty>(conn)
}

/// Trouver tous les biens immobiliers
pub fn find_all_realties(conn: &mut PgConnection) -> QueryResult<Vec<Realty>> {
    realties.load::<Realty>(conn)
}

/// Mettre à jour un bien immobilier
pub fn update_realty(
    conn: &mut PgConnection,
    realty_id: i32,
    updated_realty: &NewRealty,
) -> QueryResult<Realty> {
    diesel::update(realties.filter(id.eq(realty_id)))
        .set((
            name.eq(&updated_realty.name),
            user_id.eq(&updated_realty.user_id),
            street_number.eq(&updated_realty.street_number),
            street_name.eq(&updated_realty.street_name),
            complement_address.eq(&updated_realty.complement_address),
            city.eq(&updated_realty.city),
            zip_code.eq(&updated_realty.zip_code),
            region.eq(&updated_realty.region),
            country.eq(&updated_realty.country),
            address.eq(&updated_realty.address),
            image_url.eq(&updated_realty.image_url),
        ))
        .get_result(conn)
}

/// Supprimer un bien immobilier
pub fn delete_realty(conn: &mut PgConnection, realty_id: i32) -> QueryResult<usize> {
    diesel::delete(realties.filter(id.eq(realty_id)))
        .execute(conn)
}

/// Rechercher des biens immobiliers par nom ou adresse
pub fn search_realties(
    conn: &mut PgConnection,
    search_query: &str,
) -> QueryResult<Vec<Realty>> {
    let search_pattern = format!("%{}%", search_query);
    realties
        .filter(
            name.ilike(&search_pattern)
                .or(address.ilike(&search_pattern))
        )
        .load::<Realty>(conn)
}

/// Compter le nombre de biens immobiliers par utilisateur
pub fn count_realties_by_user_id(conn: &mut PgConnection, user_id_val: i32) -> QueryResult<i64> {
    realties
        .filter(user_id.eq(user_id_val))
        .count()
        .get_result(conn)
}

/// Compter le nombre total de biens immobiliers
pub fn count_all_realties(conn: &mut PgConnection) -> QueryResult<i64> {
    realties.count().get_result(conn)
}

/// Vérifier si un bien immobilier existe
pub fn realty_exists(conn: &mut PgConnection, realty_id: i32) -> QueryResult<bool> {
    realties
        .filter(id.eq(realty_id))
        .count()
        .get_result::<i64>(conn)
        .map(|count| count > 0)
}
