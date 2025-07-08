/// Ce module gère la dé-construction puis la construction de réponses HTTP.
use serde::de::DeserializeOwned;
use std::collections::HashMap;

use crate::utils::logger;

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

fn parse_first_line(line: &str) -> Option<(&str, &str)> {
    let mut parts = line.split_whitespace();
    Some((parts.next()?, parts.next()?))
}

#[derive(Clone)]
pub struct RequestContext {
    pub method: String,
    pub path: String,
    pub path_segments: Vec<String>,
    pub query_params: HashMap<String, String>,
    pub headers: HashMap<String, String>,
    pub user_id: Option<i32>,
    pub raw_body: Option<String>,
    pub path_params: HashMap<String, String>,
}

impl RequestContext {
    pub fn new(first_line: &str, request: &str, user_id: Option<i32>) -> Option<Self> {
        let (method, full_path) = parse_first_line(first_line)?;
        let (path, query_str) = full_path.split_once('?').unwrap_or((full_path, ""));
        let path_segments = path.trim_start_matches('/').split('/').map(|s| s.to_string()).collect();

        let query_params = query_str
            .split('&')
            .filter_map(|pair| pair.split_once('='))
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect();

        let headers = request
            .lines()
            .skip(1)
            .take_while(|l| !l.trim().is_empty())
            .filter_map(|line| line.split_once(':'))
            .map(|(k, v)| (k.trim().to_string(), v.trim().to_string()))
            .collect();

        let raw_body = request.find("\r\n\r\n").map(|idx| request[idx + 4..].trim().to_string());

        Some(Self {
            method: method.to_string(),
            path: path.to_string(),
            path_segments,
            query_params,
            headers,
            user_id,
            raw_body,
            path_params: HashMap::new(),
        })
    }

        pub fn parse_body<T: DeserializeOwned>(&self) -> Option<T> {
            match &self.raw_body {
                Some(body) => match serde_json::from_str::<T>(body) {
                    Ok(parsed) => Some(parsed),
                    Err(e) => {
                        logger::warning(&format!("Erreur de parsing du body : {}", e));
                        None
                    }
                },
                None => {
                    logger::debug("Aucun body à parser");
                    None
                }
            }
        }

    pub fn match_route(&mut self, method: &str, pattern: &str) -> bool {
        if self.method != method {
            return false;
        }

        let pattern_parts: Vec<&str> = pattern.trim_start_matches('/').split('/').collect();
        if pattern_parts.len() != self.path_segments.len() {
            return false;
        }

        let mut params = HashMap::new();
        for (seg, pat) in self.path_segments.iter().zip(pattern_parts.iter()) {
            if pat.starts_with(":") {
                params.insert(pat[1..].to_string(), seg.clone());
            } else if pat != seg {
                return false;
            }
        }

        self.path_params = params;
        true
    }

    pub fn param<T: std::str::FromStr>(&self, key: &str) -> Option<T> {
        self.path_params.get(key)?.parse::<T>().ok()
    }

    pub fn query<T: std::str::FromStr>(&self, key: &str) -> Option<T> {
        self.query_params.get(key)?.parse::<T>().ok()
    }
}
