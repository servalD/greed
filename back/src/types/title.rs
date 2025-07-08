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
        println!("title is empty");
        Err(TitleError::Empty)
    } else if title.len() > 50 {
        println!("title is too long");
        Err(TitleError::TooLong)
    } else {
        println!("title is valid");
        Ok(())
    }
}
