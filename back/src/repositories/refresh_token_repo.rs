use chrono::prelude::*;
use diesel::prelude::*;
use crate::models::refresh_token::{RefreshToken, NewRefreshToken};
use back::schema::refresh_tokens::dsl::*;

pub fn store_refresh_token(conn: &mut PgConnection, new: &NewRefreshToken) -> QueryResult<RefreshToken> {
    diesel::insert_into(refresh_tokens)
        .values(new)
        .get_result(conn)
}

// Selection un refresh_token non expiré pour une session d'un utilisateur 
pub fn check_refresh_token(
    conn: &mut PgConnection,
    token_str: &str,
    // _user_id: i32, // Commenté pour éviter de passer l'ID utilisateur mais peux être une faille de sécurité ??
) -> QueryResult<RefreshToken> {

    refresh_tokens
      .filter(token.eq(&token_str))
      // .filter(user_id.eq(_user_id))
      .filter(expires_at.gt(Utc::now().naive_utc()))
      .select(RefreshToken::as_select())
      .first::<RefreshToken>(conn)
}

pub fn revoke_refresh_token(
    conn: &mut PgConnection,
    token_str: &str,
) -> QueryResult<usize> {
    diesel::delete(refresh_tokens.filter(token.eq(token_str))).execute(conn)
}

pub fn revoke_all_refresh_tokens_for_user(
    conn: &mut PgConnection,
    uid: i32
) -> QueryResult<usize> {
    diesel::delete(refresh_tokens.filter(user_id.eq(uid))).execute(conn)
}

pub fn purge_expired_refresh_tokens(
    conn: &mut PgConnection,
) -> QueryResult<usize> {
    diesel::delete(refresh_tokens.filter(expires_at.lt(Utc::now().naive_utc()))).execute(conn)
}
