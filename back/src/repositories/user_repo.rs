use diesel::prelude::*;
use crate::models::user::{User, NewUser, UpdateUserData, Role};
use back::schema::users::dsl::*;

pub fn create_user(conn: &mut PgConnection, new: &NewUser) -> QueryResult<usize> {
    diesel::insert_into(users).values(new).execute(conn)
}

pub fn find_user(
    conn: &mut PgConnection,
    id_opt: Option<i32>,
    eth_address_opt: Option<&str>,
    email_opt: Option<&str>,
) -> QueryResult<Option<User>> {
    use back::schema::users::dsl::*;

    if let Some(id_val) = id_opt {
        users.filter(id.eq(&id_val)).first::<User>(conn).optional()
    } else if let Some(eth_address_val) = eth_address_opt {
        users.filter(eth_address.eq(eth_address_val)).first::<User>(conn).optional()
    } else if let Some(email_val) = email_opt {
        users.filter(email.eq(email_val)).first::<User>(conn).optional()
    } else {
        Ok(None)
    }
}

pub fn update_user(
    conn: &mut PgConnection,
    user_id: i32,
    update: UpdateUserData,
) -> QueryResult<User> {
    diesel::update(users.filter(id.eq(&user_id)))
        .set(update)
        .get_result(conn)
}

pub fn delete_user(conn: &mut PgConnection, user_id: i32) -> QueryResult<usize> {
    diesel::delete(users.filter(id.eq(&user_id))).execute(conn)
}

pub fn find_users_by_role(conn: &mut PgConnection, user_role: Role) -> QueryResult<Vec<User>> {
    users.filter(role.eq(user_role)).load::<User>(conn)
}

pub fn find_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users.load::<User>(conn)
}
