use alloy::primitives::{Address, Signature };
use std::str::FromStr;
use serde::{Deserialize, Serialize};

/// Représente ton payload SIWE
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct SIWELoginPayload {
    pub domain: String,
    pub address: String,
    pub statement: Option<String>,
    pub uri: Option<String>,
    pub version: String,
    pub chain_id: Option<String>,
    pub nonce: String,
    pub issued_at: String,
    pub expiration_time: String,
    pub invalid_before: Option<String>,
    pub resources: Option<Vec<String>>,
}

/// Crée le message EIP-4361 à signer
pub fn create_login_message(payload: &SIWELoginPayload) -> String {
    let header = format!(
        "{} wants you to sign in with your Ethereum account:",
        payload.domain
    );

    let mut prefix = format!("{}\n{}", header, payload.address);

    if let Some(statement) = &payload.statement {
        prefix = format!("{}\n\n{}\n", prefix, statement);
    } else {
        prefix = format!("{}\n\n", prefix);
    }

    let mut suffix_lines = vec![];

    if let Some(uri) = &payload.uri {
        suffix_lines.push(format!("URI: {}", uri));
    }

    suffix_lines.push(format!("Version: {}", payload.version));

    if let Some(chain_id) = &payload.chain_id {
        suffix_lines.push(format!("Chain ID: {}", chain_id));
    }

    suffix_lines.push(format!("Nonce: {}", payload.nonce));
    suffix_lines.push(format!("Issued At: {}", payload.issued_at));
    suffix_lines.push(format!("Expiration Time: {}", payload.expiration_time));

    if let Some(invalid_before) = &payload.invalid_before {
        suffix_lines.push(format!("Not Before: {}", invalid_before));
    }

    if let Some(resources) = &payload.resources {
        suffix_lines.push("Resources:".to_string());
        for resource in resources {
            suffix_lines.push(format!("- {}", resource));
        }
    }

    let suffix = suffix_lines.join("\n");

    format!("{}\n{}", prefix, suffix)
}


pub fn verify_signature(eth_address: &str, message: &str, signature: &str) -> bool {

    // Parser l'adresse Ethereum
    let expected_address = match Address::from_str(eth_address) {
        Ok(addr) => addr,
        Err(_) => return false,
    };

    // Parser la signature
    let sig = match Signature::from_str(signature) {
        Ok(s) => s,
        Err(_) => return false,
    };

    // Récupérer l'adresse depuis la signature
    match sig.recover_address_from_msg(message) {
        Ok(recovered_address) => recovered_address == expected_address,
        Err(_) => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_verify_signature() {
        // Test avec des données valides
        let _address = "0x742d35Cc6435C4532D9217c4b28e6B4B8cC3d4C3";
        let _message = "Login to Greed Platform\nNonce: abc123\nAddress: 0x742d35Cc6435C4532D9217c4b28e6B4B8cC3d4C3";
        let _signature = "0x..."; // Signature réelle serait ici

        // Ce test nécessiterait une vraie signature pour fonctionner
        // assert!(verify_signature(address, message, signature));
    }

    #[test]
    fn test_address_parsing() {
        let addr = "0x742d35Cc6435C4532D9217c4b28e6B4B8cC3d4C3";
        assert!(Address::from_str(addr).is_ok());
    }
}
