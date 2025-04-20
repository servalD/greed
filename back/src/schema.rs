// @generated automatically by Diesel CLI.

diesel::table! {
    refresh_tokens (id) {
        id -> Int4,
        user_id -> Int4,
        token -> Text,
        created_at -> Timestamp,
        expires_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        username -> Text,
        email -> Text,
        eth_address -> Nullable<Text>,
        password_hash -> Text,
    }
}

diesel::joinable!(refresh_tokens -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    refresh_tokens,
    users,
);
