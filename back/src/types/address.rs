use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum AddressError {
    #[error("The Ethereum address cannot be empty")]
    Empty,
    #[error("The Ethereum address must start with '0x'")]
    InvalidPrefix,
    #[error("The Ethereum address must be exactly 42 characters long")]
    InvalidLength,
    #[error("The Ethereum address contains invalid characters")]
    InvalidCharacters,
}

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub struct Address(String);

impl TryFrom<String> for Address {
    type Error = AddressError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        validate_eth_address(&value)?;
        Ok(Self(value))
    }
}

impl TryFrom<&str> for Address {
    type Error = AddressError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        validate_eth_address(value)?;
        Ok(Self(value.to_string()))
    }
}

fn validate_eth_address(address: &str) -> Result<(), AddressError> {
    if address.is_empty() {
        println!("Ethereum address is empty");
        return Err(AddressError::Empty);
    }
    if !address.starts_with("0x") {
        println!("Ethereum address does not start with '0x'");
        return Err(AddressError::InvalidPrefix);
    }
    if address.len() != 42 {
        println!("Ethereum address is not 42 characters long");
        return Err(AddressError::InvalidLength);
    }
    if !address.chars().skip(2).all(|c| c.is_digit(16)) {
        println!("Ethereum address contains invalid characters");
        return Err(AddressError::InvalidCharacters);
    }
    println!("Ethereum address is valid");
    Ok(())
}
