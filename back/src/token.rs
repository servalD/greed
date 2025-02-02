use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct NFT {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub image_url: String,
    pub owner: String,
    pub attributes: Vec<Attribute>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Attribute {
    pub trait_type: String,
    pub value: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NFTCollection {
    pub name: String,
    pub symbol: String,
    pub creator: String,
    pub nfts: Vec<NFT>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub message: Option<String>,
}
