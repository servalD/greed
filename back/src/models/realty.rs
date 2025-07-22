use back::schema::realties;
use diesel::{Insertable, Queryable, Selectable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = realties)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Realty {
    pub id: i32,
    pub name: String,
    pub user_id: i32, // promoter
    pub street_number: String,
    pub street_name: String,
    pub complement_address: Option<String>,
    pub city: String,
    pub zip_code: String,
    pub region: String,
    pub country: String,
    pub address: String,
    pub promoter: String,
    pub image_url: String,
    pub apartment_count: i32,
}

#[derive(Serialize)]
pub struct RealtySafe {
    pub id: i32,
    pub name: String,
    pub user_id: i32,
    pub street_number: String,
    pub street_name: String,
    pub complement_address: Option<String>,
    pub city: String,
    pub zip_code: String,
    pub region: String,
    pub country: String,
    pub address: String,
    pub promoter: String,
    pub image_url: String,
    pub apartment_count: i32,
}

impl Realty {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {
        let realty_safe = RealtySafe {
            id: self.id,
            name: self.name.clone(),
            user_id: self.user_id,
            street_number: self.street_number.clone(),
            street_name: self.street_name.clone(),
            complement_address: self.complement_address.clone(),
            city: self.city.clone(),
            zip_code: self.zip_code.clone(),
            region: self.region.clone(),
            country: self.country.clone(),
            address: self.address.clone(),
            promoter: self.promoter.clone(),
            image_url: self.image_url.clone(),
            apartment_count: self.apartment_count,
        };
        serde_json::to_string(&realty_safe)
    }
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = realties)]
pub struct NewRealty {
    pub name: String,
    pub user_id: i32,
    pub street_number: String,
    pub street_name: String,
    pub complement_address: Option<String>,
    pub city: String,
    pub zip_code: String,
    pub region: String,
    pub country: String,
    pub address: String,
    pub promoter: String,
    pub image_url: String,
    pub apartment_count: i32,
}
