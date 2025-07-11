use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use chrono::{Utc, Duration, DateTime};
use uuid::Uuid;
use crate::utils::web3_verify::{SIWELoginPayload, create_login_message, verify_signature};

#[derive(Clone)]
pub struct SiweService {
    // Store nonces in memory (in production, use Redis or database)
    nonces: Arc<RwLock<HashMap<String, SIWELoginPayload>>>,
}

impl SiweService {
    pub fn new() -> Self {
        Self {
            nonces: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// Génère un message SIWE conforme à EIP-4361
    pub fn generate_siwe_nonce(&self, eth_address: &str, chain_id: &str) -> Result<SIWELoginPayload, String> {
        let nonce = Uuid::new_v4().to_string().replace("-", "")[..16].to_string();
        
        // Stocker le nonce
        let domain = "localhost:3001"; // À configurer selon votre environnement
        let uri = "http://localhost:3001/login";
        let now = Utc::now();
        let later = now + Duration::minutes(5);
        let nonce_data = SIWELoginPayload { 
            domain: domain.to_string(),
            address: eth_address.to_string(),
            statement: Some("En signant ce message, vous acceptez les CGU de Greed Agency.".to_string()),
            uri: Some(uri.to_string()),
            version: "1".to_string(),
            chain_id: Some(chain_id.to_string()),
            nonce: nonce.clone(),
            expiration_time: later.to_rfc3339(),
            issued_at: now.to_rfc3339(),
            invalid_before: None,
            resources: None,
            };
        
        {
            let mut nonces = self.nonces.write().map_err(|_| "Lock error")?;
            nonces.insert(nonce.clone(), nonce_data.clone());
        }

        Ok(nonce_data)
    }

    /// Valide un message SIWE signé
    pub fn validate_siwe_signature(&self, nonce: &str,signature: &str) -> Result<String, String> {
        
        let nonces = self.nonces.read().map_err(|_| "Lock error")?;
        if let Some(stored_payload) = nonces.get(nonce) {
            let message = create_login_message(&stored_payload);
            // Vérifier la signature avec Alloy
            if !verify_signature(&stored_payload.address, &message, signature) {
                return Err("Signature invalide".to_string());
            }
            Ok(stored_payload.address.clone())
        } else {
            Err("Nonce invalide ou expiré".to_string())
        }
            
    }

    /// Nettoie les nonces expirés (à appeler périodiquement)
    /// ✅ Plus simple : ne nettoie que les expirés, pas les utilisés
    pub fn cleanup_expired_nonces(&self) {
        if let Ok(mut nonces) = self.nonces.write() {
            let now = Utc::now();
            
            nonces.retain(|_, nonce_data| {
                match DateTime::parse_from_rfc3339(&nonce_data.issued_at){
                    Ok(issued_at) => now - issued_at.to_utc() <= Duration::minutes(5),
                    Err(_) => false, // Si le format est invalide, on considère que c'est expiré
                }
            });
        }
    }
}
