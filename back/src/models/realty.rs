use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::realties;

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
    pub image_url: String,
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
    pub image_url: String,
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
            image_url: self.image_url.clone(),
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
    pub image_url: String,
}
