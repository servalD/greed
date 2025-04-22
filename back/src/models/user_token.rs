use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable};
use back::schema::user_token;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = user_token)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct UserToken {
    pub user_id: i32,
    pub token_id: i32,
    pub supply: i64, // supply as integer
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = user_token)]
pub struct NewUserToken {
    pub user_id: i32,
    pub token_id: i32,
    pub supply: i64,
}
