use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Clone, Eq, Serialize, Deserialize)]
pub enum Status {
    ToDo,
    InProgress,
    Done,
}

impl Status {
    pub fn as_str(&self) -> &'static str {
        match self {
            Status::ToDo => "todo",
            Status::InProgress => "inprogress",
            Status::Done => "done",
        }
    }

    pub fn all_variants() -> Vec<Status> {
        vec![Status::ToDo, Status::InProgress, Status::Done]
    }
}

impl std::convert::TryFrom<String> for Status {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        let value = value.to_lowercase();
        match value.as_str() {
            "todo" => Ok(Status::ToDo),
            "inprogress" => Ok(Status::InProgress),
            "done" => Ok(Status::Done),
            _ => Err(format!("Invalid status: '{}'. Valid values are: todo, inprogress, done", value)),
        }
    }
}

impl std::convert::TryFrom<&str> for Status {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Status::try_from(value.to_string())
    }
}

impl std::fmt::Display for Status {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_status_from_string() {
        assert_eq!(Status::try_from("todo".to_string()).unwrap(), Status::ToDo);
        assert_eq!(Status::try_from("inprogress".to_string()).unwrap(), Status::InProgress);
        assert_eq!(Status::try_from("done".to_string()).unwrap(), Status::Done);
    }

    #[test]
    fn test_valid_status_from_str() {
        assert_eq!(Status::try_from("todo").unwrap(), Status::ToDo);
        assert_eq!(Status::try_from("inprogress").unwrap(), Status::InProgress);
        assert_eq!(Status::try_from("done").unwrap(), Status::Done);
    }

    #[test]
    fn test_case_insensitive_status() {
        assert_eq!(Status::try_from("TODO").unwrap(), Status::ToDo);
        assert_eq!(Status::try_from("INPROGRESS").unwrap(), Status::InProgress);
        assert_eq!(Status::try_from("DONE").unwrap(), Status::Done);
        assert_eq!(Status::try_from("Todo").unwrap(), Status::ToDo);
        assert_eq!(Status::try_from("InProgress").unwrap(), Status::InProgress);
        assert_eq!(Status::try_from("Done").unwrap(), Status::Done);
    }

    #[test]
    fn test_invalid_status() {
        assert!(Status::try_from("invalid").is_err());
        assert!(Status::try_from("").is_err());
        assert!(Status::try_from("pending").is_err());
        assert!(Status::try_from("completed").is_err());
    }

    #[test]
    fn test_status_as_str() {
        assert_eq!(Status::ToDo.as_str(), "todo");
        assert_eq!(Status::InProgress.as_str(), "inprogress");
        assert_eq!(Status::Done.as_str(), "done");
    }

    #[test]
    fn test_status_display() {
        assert_eq!(format!("{}", Status::ToDo), "todo");
        assert_eq!(format!("{}", Status::InProgress), "inprogress");
        assert_eq!(format!("{}", Status::Done), "done");
    }

    #[test]
    fn test_status_serialization() {
        let status = Status::ToDo;
        let serialized = serde_json::to_string(&status).unwrap();
        let deserialized: Status = serde_json::from_str(&serialized).unwrap();
        assert_eq!(status, deserialized);
    }

    #[test]
    fn test_status_clone() {
        let status = Status::InProgress;
        let cloned = status.clone();
        assert_eq!(status, cloned);
    }

    #[test]
    fn test_status_equality() {
        assert_eq!(Status::ToDo, Status::ToDo);
        assert_eq!(Status::InProgress, Status::InProgress);
        assert_eq!(Status::Done, Status::Done);
        assert_ne!(Status::ToDo, Status::InProgress);
    }

    #[test]
    fn test_all_variants() {
        let variants = Status::all_variants();
        assert_eq!(variants.len(), 3);
        assert!(variants.contains(&Status::ToDo));
        assert!(variants.contains(&Status::InProgress));
        assert!(variants.contains(&Status::Done));
    }

    #[test]
    fn test_error_message_format() {
        let result = Status::try_from("invalid");
        assert!(result.is_err());
        let error = result.unwrap_err();
        assert!(error.contains("Invalid status: 'invalid'"));
        assert!(error.contains("Valid values are: todo, inprogress, done"));
    }
}
