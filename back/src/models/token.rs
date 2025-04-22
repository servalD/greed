use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::tokens;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = tokens)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Token {
    pub id: i32,
    pub apartment_id: i32,
    pub name: String,
    pub address: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = tokens)]
pub struct NewToken {
    pub apartment_id: i32,
    pub name: String,
    pub address: String,
}
