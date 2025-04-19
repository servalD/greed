use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable, AsChangeset};
use back::schema::users;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Serialize)]
pub struct UserSafe {
    pub id: i32,
    pub username: String,
    pub email: String,
}
impl User {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {
        let user_safe = UserSafe {
            id: self.id,
            username: self.username.clone(),
            email: self.email.clone(),
        };
        serde_json::to_string(&user_safe)
    }
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(AsChangeset)]
#[diesel(table_name = users)]
pub struct UpdateUserData {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password_hash: Option<String>,
}

#[derive(Deserialize)]
pub struct NewUserPayload {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UpdateUserPayload {
    pub id: i32,
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
}

#[derive(Deserialize)]
pub struct LoginPayload {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: String,
}

#[derive(Deserialize)]
pub struct FindUserPayload {
    pub id: Option<i32>,
    pub username: Option<String>,
    pub email: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteUserPayload {
    pub id: i32,
}
