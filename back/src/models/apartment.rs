use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::apartments;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = apartments)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Apartment {
    pub id: i32,
    pub realty_id: i32,
    pub token_id: i32,
    pub owner_id: i32,
    pub name: String,
    pub image_url: String,
}

#[derive(Insertable, Deserialize, Clone)]
#[diesel(table_name = apartments)]
pub struct NewApartment {
    pub realty_id: i32,
    pub token_id: i32,
    pub owner_id: i32,
    pub name: String,
    pub image_url: String,
}

#[derive(Serialize)]
pub struct ApartmentSafe {
    pub id: i32,
    pub realty_id: i32,
    pub token_id: i32,
    pub owner_id: i32,
    pub name: String,
    pub image_url: String,
}

impl Apartment {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {
        let apartment_safe = ApartmentSafe {
            id: self.id,
            realty_id: self.realty_id,
            token_id: self.token_id,
            owner_id: self.owner_id,
            name: self.name.clone(),
            image_url: self.image_url.clone(),
        };
        serde_json::to_string(&apartment_safe)
    }
}
