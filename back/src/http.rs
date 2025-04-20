/// Ce module gère la dé-construction puis la construction de réponses HTTP.
use serde::de::DeserializeOwned;

pub struct HttpResponse {
    pub status_code: u16,
    reason_phrase: &'static str,
    headers: Vec<(String, String)>,
    body: Option<String>,
}

impl HttpResponse {
    pub fn new(status_code: u16, reason_phrase: &'static str, body: Option<String>) -> Self {
        Self {
            status_code,
            reason_phrase,
            headers: Vec::new(),
            body,
        }
    }

    pub fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_string(), value.to_string()));
        self
    }

    pub fn to_string(self) -> String {
        let body_content = self.body.unwrap_or_default();
        let mut response = format!("HTTP/1.1 {} {}\r\n", self.status_code, self.reason_phrase);
        for (key, value) in self.headers {
            response.push_str(&format!("{}: {}\r\n", key, value));
        }
        response.push_str(&format!("Content-Length: {}\r\n", body_content.len()));
        response.push_str("\r\n");
        response.push_str(&body_content);
        response
    }

    pub fn ok(body: Option<String>) -> Self {
        let content_type = if body.is_some() { "application/json" } else { "text/plain" };
        HttpResponse::new(200, "OK", body).header("Content-Type", content_type)
    }

    pub fn bad_request(msg: &str) -> Self {
        HttpResponse::new(400, "Bad Request", Some(msg.to_string()))
        .header("Content-Type", "text/plain")
    }

    pub fn unauthorized() -> Self {
        HttpResponse::new(401, "Unauthorized", Some("Unauthorized".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn forbidden() -> Self {
        HttpResponse::new(403, "Forbidden", Some("Forbidden".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn not_found() -> Self {
        HttpResponse::new(404, "Not Found", Some("Not Found".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn method_not_allowed() -> Self {
        HttpResponse::new(405, "Method Not Allowed", Some("Method Not Allowed".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn conflict() -> Self {
        HttpResponse::new(409, "Conflict", Some("Conflict".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn i_am_a_teapot() -> Self {
        HttpResponse::new(418, "I'm a teapot", Some("I'm a teapot".to_string()))
            .header("Content-Type", "text/plain")
    }

    pub fn internal_server_error() -> Self {
        HttpResponse::new(500, "Internal Server Error", Some("Internal Server Error".to_string()))
            .header("Content-Type", "text/plain")
    }
}

// Prise en charge des structures des payload de manière générique
pub fn extract_payload<T: DeserializeOwned>(request: &str) -> Result<T, HttpResponse> {
    if let Some(index) = request.find("\r\n\r\n") {
        let body = &request[index + 4..];
        serde_json::from_str::<T>(body).map_err(|_| {
            HttpResponse::bad_request("Invalid JSON payload".into())
        })
    } else {
        Err(HttpResponse::bad_request("Missing body".into()))
    }
}
