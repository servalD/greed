use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::user_apartment;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = user_apartment)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct UserApartment {
    pub user_id: i32,
    pub apartment_id: i32,
    pub part: bigdecimal::BigDecimal, // decimal(5,2)
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = user_apartment)]
pub struct NewUserApartment {
    pub user_id: i32,
    pub apartment_id: i32,
    pub part: bigdecimal::BigDecimal,
}
