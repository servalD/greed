use diesel::{Queryable, Insertable, Selectable};
use back::schema::refresh_tokens;

#[derive(Queryable, Insertable, Selectable, Clone)]
#[diesel(table_name = refresh_tokens)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct RefreshToken {
    pub id: i32, // ← manquait
    pub user_id: i32,
    pub token: String,
    pub created_at: chrono::NaiveDateTime,
    pub expires_at: chrono::NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = refresh_tokens)]
pub struct NewRefreshToken {
    pub user_id: i32,
    pub token: String,
    pub expires_at: chrono::NaiveDateTime,
}
