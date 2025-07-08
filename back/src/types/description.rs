use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub struct Description(String);

#[derive(Debug, thiserror::Error)]
pub enum DescriptionError {
    #[error("The description cannot be empty")]
    Empty,
    #[error("The description cannot be longer than 500 bytes")]
    TooLong,
}

impl Description {
    pub fn new(value: String) -> Result<Self, DescriptionError> {
        validate_description(&value)?;
        Ok(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_string(self) -> String {
        self.0
    }
}

impl TryFrom<String> for Description {
    type Error = DescriptionError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        validate_description(&value)?;
        Ok(Self(value))
    }
}

impl TryFrom<&str> for Description {
    type Error = DescriptionError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        validate_description(value)?;
        Ok(Self(value.to_string()))
    }
}

fn validate_description(description: &str) -> Result<(), DescriptionError> {
    if description.is_empty() {
        Err(DescriptionError::Empty)
    } else if description.len() > 500 {
        Err(DescriptionError::TooLong)
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_description() {
        let desc = Description::try_from("Une description valide").unwrap();
        assert_eq!(desc.as_str(), "Une description valide");
    }

    #[test]
    fn test_valid_description_from_string() {
        let desc = Description::try_from("Une description valide".to_string()).unwrap();
        assert_eq!(desc.as_str(), "Une description valide");
    }

    #[test]
    fn test_description_max_length() {
        let long_desc = "a".repeat(500);
        assert!(Description::try_from(long_desc.as_str()).is_ok());
    }

    #[test]
    fn test_empty_description() {
        let result = Description::try_from("");
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), DescriptionError::Empty));
    }

    #[test]
    fn test_description_too_long() {
        let long_desc = "a".repeat(501);
        let result = Description::try_from(long_desc.as_str());
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), DescriptionError::TooLong));
    }

    #[test]
    fn test_description_with_special_characters() {
        let desc =
            Description::try_from("Description avec des caractères spéciaux: àéèêôù!@#$%^&*()")
                .unwrap();
        assert_eq!(
            desc.as_str(),
            "Description avec des caractères spéciaux: àéèêôù!@#$%^&*()"
        );
    }

    #[test]
    fn test_description_with_newlines() {
        let desc = Description::try_from("Description\navec des\nretours à la ligne").unwrap();
        assert_eq!(desc.as_str(), "Description\navec des\nretours à la ligne");
    }

    #[test]
    fn test_description_serialization() {
        let desc = Description::try_from("Test description").unwrap();
        let serialized = serde_json::to_string(&desc).unwrap();
        let deserialized: Description = serde_json::from_str(&serialized).unwrap();
        assert_eq!(desc, deserialized);
    }

    #[test]
    fn test_description_clone() {
        let desc = Description::try_from("Test description").unwrap();
        let cloned = desc.clone();
        assert_eq!(desc, cloned);
    }

    #[test]
    fn test_description_into_string() {
        let desc = Description::try_from("Test description").unwrap();
        let string_value = desc.into_string();
        assert_eq!(string_value, "Test description");
    }
}
