use serde::{Deserialize, Serialize};

use crate::description::Description;
use crate::title::Title;
use crate::address::Address;

#[derive(Serialize, Deserialize, Debug)]
pub struct Copro {
    pub contract_address: Address,
    pub geo_address: String,
    pub name: Title,
    pub symbol: String,
    pub creator: Address,
    pub description: Option<Description>,
    pub image_url: String,
    pub owner: Address,
    pub flats: Vec<Flat>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Flat {
    pub image_url: String,
    pub owner: Address,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Agency {
    pub name: Title,
    pub agents: Vec<Agent>,
    pub creator: Address,
    pub copros: Vec<Copro>,
    pub clients: Vec<Client>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Agent {
    pub name: Title,
    pub address: Address,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Client {
    pub name: Title,
    pub address: Address,
    pub accepted: bool,
    pub suspicious: bool,
}
