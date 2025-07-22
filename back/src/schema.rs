// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "role"))]
    pub struct Role;
}

diesel::table! {
    apartments (id) {
        id -> Int4,
        realty_id -> Int4,
        token_id -> Int4,
        owner_id -> Int4,
        name -> Text,
        image_url -> Text,
    }
}

diesel::table! {
    realties (id) {
        id -> Int4,
        name -> Text,
        user_id -> Int4,
        street_number -> Text,
        street_name -> Text,
        complement_address -> Nullable<Text>,
        city -> Text,
        zip_code -> Text,
        region -> Text,
        country -> Text,
        address -> Text,
        promoter -> Int4,
        image_url -> Text,
        apartment_count -> Int4,
    }
}

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
    tokens (id) {
        id -> Int4,
        apartment_id -> Int4,
        name -> Text,
        address -> Text,
    }
}

diesel::table! {
    user_apartment (user_id, apartment_id) {
        user_id -> Int4,
        apartment_id -> Int4,
        part -> Numeric,
    }
}

diesel::table! {
    user_token (user_id, token_id) {
        user_id -> Int4,
        token_id -> Int4,
        supply -> Int8,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Role;

    users (id) {
        id -> Int4,
        email -> Nullable<Text>,
        first_name -> Nullable<Text>,
        last_name -> Nullable<Text>,
        eth_address -> Text,
        role -> Role,
    }
}

diesel::joinable!(apartments -> realties (realty_id));
diesel::joinable!(apartments -> users (owner_id));
diesel::joinable!(refresh_tokens -> users (user_id));
diesel::joinable!(tokens -> apartments (apartment_id));
diesel::joinable!(user_apartment -> apartments (apartment_id));
diesel::joinable!(user_apartment -> users (user_id));
diesel::joinable!(user_token -> tokens (token_id));
diesel::joinable!(user_token -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    apartments,
    realties,
    refresh_tokens,
    tokens,
    user_apartment,
    user_token,
    users,
);
