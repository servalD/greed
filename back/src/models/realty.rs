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
    pub address: String,
}

#[derive(Serialize)]
pub struct RealtySafe {
    pub id: i32,
    pub name: String,
    pub user_id: i32,
    pub address: String,
}

impl Realty {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {
        let realty_safe = RealtySafe {
            id: self.id,
            name: self.name.clone(),
            user_id: self.user_id,
            address: self.address.clone(),
        };
        serde_json::to_string(&realty_safe)
    }
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = realties)]
pub struct NewRealty {
    pub name: String,
    pub user_id: i32,
    pub address: String,
}
