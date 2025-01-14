use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum ImageTitleError {
    #[error("The title cannot be empty")]
    Empty,
    #[error("The title cannot be longer than 50 bytes")]
    TooLong,
}

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub struct ImageTitle(String);

impl TryFrom<String> for ImageTitle {
    type Error = ImageTitleError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        validate_title(&value)?;
        Ok(Self(value))
    }
}

impl TryFrom<&str> for ImageTitle {
    type Error = ImageTitleError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        validate_title(value)?;
        Ok(Self(value.to_string()))
    }
}

fn validate_title(title: &str) -> Result<(), ImageTitleError> {
    if title.is_empty() {
        println!("title is empty");
        Err(ImageTitleError::Empty)
    } else if title.len() > 50 {
        println!("title is too long");
        Err(ImageTitleError::TooLong)
    } else {
        println!("title is valid");
        Ok(())
    }
}
