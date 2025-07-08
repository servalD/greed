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

#[derive(Serialize)]
pub struct ApartmentSafe {
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

impl Apartment {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {
        let apartment_safe = ApartmentSafe {
            id: self.id,
            realty_id: self.realty_id,
            name: self.name.clone(),
            street_number: self.street_number.clone(),
            street_name: self.street_name.clone(),
            complement_address: self.complement_address.clone(),
            city: self.city.clone(),
            zip_code: self.zip_code.clone(),
            region: self.region.clone(),
            country: self.country.clone(),
            address: self.address.clone(),
            image_url: self.image_url.clone(),
        };
        serde_json::to_string(&apartment_safe)
    }
}
