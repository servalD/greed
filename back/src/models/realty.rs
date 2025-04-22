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

#[derive(Insertable, Deserialize)]
#[diesel(table_name = realties)]
pub struct NewRealty {
    pub name: String,
    pub user_id: i32,
    pub address: String,
}
