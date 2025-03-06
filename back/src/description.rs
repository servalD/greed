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
      println!("description is empty");
        Err(DescriptionError::Empty)
    } else if description.len() > 500 {
      println!("description is too long");
        Err(DescriptionError::TooLong)
    } else {
      println!("description is valid");
        Ok(())
    }
}
