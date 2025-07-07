use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::apartments;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = apartments)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Apartment {
    pub id: i32,
    pub realty_id: i32,
    pub name: String,
    pub street_number: String,
    pub street_name: String,
    pub complement_address: Option<String>,
    pub city: String,
    pub zip_code: String,
    pub region: String,
    pub country: String,
    pub address: String,
    pub image_url: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = apartments)]
pub struct NewApartment {
    pub realty_id: i32,
    pub name: String,
    pub street_number: String,
    pub street_name: String,
    pub complement_address: Option<String>,
    pub city: String,
    pub zip_code: String,
    pub region: String,
    pub country: String,
    pub address: String,
    pub image_url: String,
}
