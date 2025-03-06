// Pour activer les macros Diesel
#[macro_use]
extern crate diesel;
extern crate dotenv;

use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;

mod schema {
    // Schéma Diesel généré (vous pouvez le créer avec `diesel print-schema`)
    table! {
        copros (id) {
            id -> Int4,
            contract_address -> Varchar,
            geo_address -> Varchar,
            name -> Varchar,
            symbol -> Varchar,
            creator -> Varchar,
            description -> Nullable<Text>,
            image_url -> Varchar,
            owner -> Varchar,
        }
    }

    table! {
        flats (id) {
            id -> Int4,
            copro_id -> Int4,
            image_url -> Varchar,
            owner -> Varchar,
        }
    }

    table! {
        agencies (id) {
            id -> Int4,
            name -> Varchar,
            creator -> Varchar,
        }
    }

    table! {
        agents (id) {
            id -> Int4,
            agency_id -> Int4,
            name -> Varchar,
            address -> Varchar,
        }
    }

    table! {
        clients (id) {
            id -> Int4,
            agency_id -> Int4,
            name -> Varchar,
            address -> Varchar,
            accepted -> Bool,
            suspicious -> Bool,
        }
    }

    joinable!(flats -> copros (copro_id));
    joinable!(agents -> agencies (agency_id));
    joinable!(clients -> agencies (agency_id));

    allow_tables_to_appear_in_same_query!(
        copros,
        flats,
        agencies,
        agents,
        clients,
    );
}

mod models {
    use super::schema::*;
    use serde::{Serialize, Deserialize};
    use diesel::prelude::*;

    // --- Copro et Flat ---
    #[derive(Queryable, Identifiable, Serialize, Deserialize, Debug)]
    #[table_name = "copros"]
    pub struct Copro {
        pub id: i32,
        pub contract_address: String, // Address
        pub geo_address: String,
        pub name: String,             // Title
        pub symbol: String,
        pub creator: String,          // Address
        pub description: Option<String>, // Description
        pub image_url: String,
        pub owner: String,            // Address
    }

    #[derive(Insertable)]
    #[table_name = "copros"]
    pub struct NewCopro<'a> {
        pub contract_address: &'a str,
        pub geo_address: &'a str,
        pub name: &'a str,
        pub symbol: &'a str,
        pub creator: &'a str,
        pub description: Option<&'a str>,
        pub image_url: &'a str,
        pub owner: &'a str,
    }

    #[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
    #[belongs_to(Copro)]
    #[table_name = "flats"]
    pub struct Flat {
        pub id: i32,
        pub copro_id: i32,
        pub image_url: String,
        pub owner: String, // Address
    }

    #[derive(Insertable)]
    #[table_name = "flats"]
    pub struct NewFlat<'a> {
        pub copro_id: i32,
        pub image_url: &'a str,
        pub owner: &'a str,
    }

    // --- Agency, Agent et Client ---
    #[derive(Queryable, Identifiable, Serialize, Deserialize, Debug)]
    #[table_name = "agencies"]
    pub struct Agency {
        pub id: i32,
        pub name: String,    // Title
        pub creator: String, // Address
    }

    #[derive(Insertable)]
    #[table_name = "agencies"]
    pub struct NewAgency<'a> {
        pub name: &'a str,
        pub creator: &'a str,
    }

    #[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
    #[belongs_to(Agency)]
    #[table_name = "agents"]
    pub struct Agent {
        pub id: i32,
        pub agency_id: i32,
        pub name: String,    // Title
        pub address: String, // Address
    }

    #[derive(Insertable)]
    #[table_name = "agents"]
    pub struct NewAgent<'a> {
        pub agency_id: i32,
        pub name: &'a str,
        pub address: &'a str,
    }

    #[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
    #[belongs_to(Agency)]
    #[table_name = "clients"]
    pub struct Client {
        pub id: i32,
        pub agency_id: i32,
        pub name: String,    // Title
        pub address: String, // Address
        pub accepted: bool,
        pub suspicious: bool,
    }

    #[derive(Insertable)]
    #[table_name = "clients"]
    pub struct NewClient<'a> {
        pub agency_id: i32,
        pub name: &'a str,
        pub address: &'a str,
        pub accepted: bool,
        pub suspicious: bool,
    }
}

use models::*;
use schema::{agencies, copros, flats, agents, clients};

fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect("Error connecting to database")
}

fn main() {
    let connection = establish_connection();

    // --- Insertion d'une agence ---
    let new_agency = NewAgency {
        name: "Agence Test",
        creator: "0xCreatorAddress",
    };
    let inserted_agency: Agency = diesel::insert_into(agencies::table)
        .values(&new_agency)
        .get_result(&connection)
        .expect("Erreur insertion agence");
    println!("Agence insérée : {:?}", inserted_agency);

    // --- Insertion d'un copro ---
    let new_copro = NewCopro {
        contract_address: "0xContractAddress",
        geo_address: "Geo Adresse",
        name: "Copro Test",
        symbol: "SYM",
        creator: "0xCreatorAddress",
        description: Some("Description du copro"),
        image_url: "http://example.com/image.png",
        owner: "0xOwnerAddress",
    };
    let inserted_copro: Copro = diesel::insert_into(copros::table)
        .values(&new_copro)
        .get_result(&connection)
        .expect("Erreur insertion copro");
    println!("Copro inséré : {:?}", inserted_copro);

    // --- Insertion d'un flat associé au copro ---
    let new_flat = NewFlat {
        copro_id: inserted_copro.id,
        image_url: "http://example.com/flat.png",
        owner: "0xFlatOwner",
    };
    let inserted_flat: Flat = diesel::insert_into(flats::table)
        .values(&new_flat)
        .get_result(&connection)
        .expect("Erreur insertion flat");
    println!("Flat inséré : {:?}", inserted_flat);

    // --- Insertion d'un agent dans l'agence ---
    let new_agent = NewAgent {
        agency_id: inserted_agency.id,
        name: "Agent Test",
        address: "0xAgentAddress",
    };
    let inserted_agent: Agent = diesel::insert_into(agents::table)
        .values(&new_agent)
        .get_result(&connection)
        .expect("Erreur insertion agent");
    println!("Agent inséré : {:?}", inserted_agent);

    // --- Insertion d'un client dans l'agence ---
    let new_client = NewClient {
        agency_id: inserted_agency.id,
        name: "Client Test",
        address: "0xClientAddress",
        accepted: true,
        suspicious: false,
    };
    let inserted_client: Client = diesel::insert_into(clients::table)
        .values(&new_client)
        .get_result(&connection)
        .expect("Erreur insertion client");
    println!("Client inséré : {:?}", inserted_client);
}
