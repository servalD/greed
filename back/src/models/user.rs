use serde::{Serialize, Deserialize};
use diesel::{Queryable, Insertable, Selectable, AsChangeset};
use back::schema::users;
use diesel_derive_enum::DbEnum;

#[derive(Debug, DbEnum, Serialize, Clone, PartialEq, Eq, Deserialize)]
#[db_enum(existing_type_path = "back::schema::sql_types::Role")]
pub enum Role {
    Nobody = 0,
    Agency = 1,
    Agent = 2,
    Client = 3,
    Co_owner = 4,
    Guest = 5,
    Admin = 6,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub email: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub eth_address: String,
    pub role: Role,
}

#[derive(Serialize)]
pub struct UserSafe {
    pub id: i32,
    pub eth_address: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub role: Role,
}
impl User {
    pub fn safe_json(&self) -> Result<String, serde_json::Error> {// Ensure no password is included in the JSON response
        let user_safe = UserSafe {
            id: self.id,
            eth_address: self.eth_address.clone(),
            first_name: self.first_name.clone(),
            last_name: self.last_name.clone(),
            email: self.email.clone(),
            role: self.role.clone(),
        };
        serde_json::to_string(&user_safe)
    }
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub email: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub eth_address: String,
    pub role: Role,
}

#[derive(AsChangeset)]
#[diesel(table_name = users)]
pub struct UpdateUserData {
    pub id: i32,
    pub email: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub eth_address: Option<String>,
    pub role: Option<Role>,
}

#[derive(Deserialize, Debug)]
pub struct UpdateUserPayload {
    pub id: i32,
    pub email: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub eth_address: Option<String>,
    pub role: Option<Role>,
}

#[derive(Deserialize)]
pub struct FindUserPayload {
    pub id: Option<i32>,
    pub eth_address: Option<String>,
    pub email: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteUserPayload {
    pub id: i32
}
