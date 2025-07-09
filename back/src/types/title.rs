use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum TitleError {
    #[error("The title cannot be empty")]
    Empty,
    #[error("The title cannot be longer than 50 bytes")]
    TooLong,
}

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub struct Title(String);

impl Title {
    pub fn new(value: String) -> Result<Self, TitleError> {
        validate_title(&value)?;
        Ok(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_string(self) -> String {
        self.0
    }
}

impl TryFrom<String> for Title {
    type Error = TitleError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        validate_title(&value)?;
        Ok(Self(value))
    }
}

impl TryFrom<&str> for Title {
    type Error = TitleError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        validate_title(value)?;
        Ok(Self(value.to_string()))
    }
}

fn validate_title(title: &str) -> Result<(), TitleError> {
    if title.is_empty() {
        Err(TitleError::Empty)
    } else if title.len() > 50 {
        Err(TitleError::TooLong)
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_title() {
        let title = Title::try_from("Titre valide").unwrap();
        assert_eq!(title.as_str(), "Titre valide");
    }

    #[test]
    fn test_valid_title_from_string() {
        let title = Title::try_from("Titre valide".to_string()).unwrap();
        assert_eq!(title.as_str(), "Titre valide");
    }

    #[test]
    fn test_title_max_length() {
        let long_title = "a".repeat(50);
        assert!(Title::try_from(long_title.as_str()).is_ok());
    }

    #[test]
    fn test_empty_title() {
        let result = Title::try_from("");
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), TitleError::Empty));
    }

    #[test]
    fn test_title_too_long() {
        let long_title = "a".repeat(51);
        let result = Title::try_from(long_title.as_str());
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), TitleError::TooLong));
    }

    #[test]
    fn test_title_with_special_characters() {
        let title = Title::try_from("Titre avec àéèêôù!").unwrap();
        assert_eq!(title.as_str(), "Titre avec àéèêôù!");
    }

    #[test]
    fn test_title_with_numbers() {
        let title = Title::try_from("Titre123").unwrap();
        assert_eq!(title.as_str(), "Titre123");
    }

    #[test]
    fn test_title_serialization() {
        let title = Title::try_from("Test title").unwrap();
        let serialized = serde_json::to_string(&title).unwrap();
        let deserialized: Title = serde_json::from_str(&serialized).unwrap();
        assert_eq!(title, deserialized);
    }

    #[test]
    fn test_title_clone() {
        let title = Title::try_from("Test title").unwrap();
        let cloned = title.clone();
        assert_eq!(title, cloned);
    }

    #[test]
    fn test_title_into_string() {
        let title = Title::try_from("Test title").unwrap();
        let string_value = title.into_string();
        assert_eq!(string_value, "Test title");
    }

    #[test]
    fn test_title_equality() {
        let title1 = Title::try_from("Same title").unwrap();
        let title2 = Title::try_from("Same title").unwrap();
        assert_eq!(title1, title2);
    }

    #[test]
    fn test_title_with_whitespace() {
        let title = Title::try_from("  Titre avec espaces  ").unwrap();
        assert_eq!(title.as_str(), "  Titre avec espaces  ");
    }

    #[test]
    fn test_single_character_title() {
        let title = Title::try_from("A").unwrap();
        assert_eq!(title.as_str(), "A");
    }
}
