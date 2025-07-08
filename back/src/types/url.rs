use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, thiserror::Error)]
pub enum UrlError {
    #[error("The URL cannot be empty")]
    Empty,
    #[error("The URL format is invalid")]
    InvalidFormat,
    #[error("The URL scheme must be http or https")]
    InvalidScheme,
    #[error("The URL is too long (maximum 2048 characters)")]
    TooLong,
}

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub struct Url(String);

impl Url {
    pub fn new(value: String) -> Result<Self, UrlError> {
        validate_url(&value)?;
        Ok(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_string(self) -> String {
        self.0
    }
}

impl TryFrom<String> for Url {
    type Error = UrlError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl TryFrom<&str> for Url {
    type Error = UrlError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::new(value.to_string())
    }
}

impl fmt::Display for Url {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl AsRef<str> for Url {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

fn validate_url(url: &str) -> Result<(), UrlError> {
    if url.is_empty() {
        return Err(UrlError::Empty);
    }

    if url.len() > 2048 {
        return Err(UrlError::TooLong);
    }

    // Vérification basique du format URL
    if !url.contains("://") {
        return Err(UrlError::InvalidFormat);
    }

    let parts: Vec<&str> = url.splitn(2, "://").collect();
    if parts.len() != 2 {
        return Err(UrlError::InvalidFormat);
    }

    let scheme = parts[0].to_lowercase();
    if scheme != "http" && scheme != "https" {
        return Err(UrlError::InvalidScheme);
    }

    let domain_and_path = parts[1];
    if domain_and_path.is_empty() {
        return Err(UrlError::InvalidFormat);
    }

    // Vérification basique du domaine (au moins un point ou localhost)
    let domain = domain_and_path.split('/').next().unwrap_or("");
    if domain.is_empty() {
        return Err(UrlError::InvalidFormat);
    }

    // Accepter localhost ou domaines avec au moins un point
    if domain != "localhost" && !domain.contains('.') && !domain.contains(':') {
        return Err(UrlError::InvalidFormat);
    }

    // Pour localhost avec port, extraire juste localhost
    if domain.starts_with("localhost:") {
        return Ok(());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_urls() {
        assert!(Url::try_from("https://example.com").is_ok());
        assert!(Url::try_from("http://example.com").is_ok());
        assert!(Url::try_from("https://example.com/path").is_ok());
        assert!(Url::try_from("https://subdomain.example.com").is_ok());
        assert!(Url::try_from("http://localhost").is_ok());
        assert!(Url::try_from("http://localhost:3000").is_ok());
    }

    #[test]
    fn test_invalid_urls() {
        assert!(Url::try_from("").is_err());
        assert!(Url::try_from("not-a-url").is_err());
        assert!(Url::try_from("ftp://example.com").is_err());
        assert!(Url::try_from("https://").is_err());
        assert!(Url::try_from("https://invaliddomainwithoutdot").is_err());
    }

    #[test]
    fn test_url_too_long() {
        let long_url = format!("https://example.com/{}", "a".repeat(2040));
        assert!(Url::try_from(long_url.as_str()).is_err());
    }
}
