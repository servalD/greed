use std::sync::Arc;
use tokio::sync::RwLock;
use crate::store::{ImageDraft, ImageId, ImagePatch, ImageStore};
use tokio::net::TcpStream;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use serde_json::json;

pub fn fmt_error_response(
    status_code: u16,
    message: &str,
) -> String{
    format!(
        "HTTP/1.1 {} {}\r\nContent-Type: application/json\r\n\r\n{}",
        status_code,
        http_status_message(status_code),
        serde_json::json!({ "error": message })
    )
}

fn http_status_message(status_code: u16) -> &'static str {
    match status_code {
        400 => "Bad Request",
        404 => "Not Found",
        500 => "Internal Server Error",
        _ => "Error",
    }
}

pub async fn handle_client(mut stream: TcpStream, store: Arc<RwLock<ImageStore>>) {
    let (mut reader, mut writer) = stream.split();
    // copy(&mut reader, &mut writer).await.unwrap();
    let mut buffer = Vec::new();
    let mut chunk = [0; 1024];// 1KB c'est deja bien, non mais alors!

    let n = reader.read(&mut chunk).await.unwrap();
    buffer.extend_from_slice(&chunk[..n]);

    //

    let request = String::from_utf8_lossy(&buffer);
    println!("Request: {}", request);

    if request.starts_with("POST /images") {
        handle_post(&request, &mut writer, store).await;
    } else if request.starts_with("GET /images/") {
        handle_get(&request, &mut writer, store).await;
    } else if request.starts_with("PATCH /images/") {
        handle_update(&request, &mut writer, store).await;
    } else {
        writer.write_all(fmt_error_response(404, "Route not found").as_bytes()).await.unwrap();
    }
}

async fn handle_post(request: &str, writer: &mut (impl AsyncWriteExt + Unpin), store: Arc<RwLock<ImageStore>>) {
    if let Some(body_start) = request.find("\r\n\r\n") {
        let body = &request[body_start + 4..];

        println!("Body: {}", body);
        if let Ok(image) = serde_json::from_str::<ImageDraft>(body) {
            println!("Parsed image: {:?}", image);
            let mut guard = store.write().await;
            let image_id = guard.add_image(image);

            let response_body = json!({
                "status": "success",
                "image_id": image_id,
            });

            let response = format!(
                "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{}",
                response_body
            );

            writer.write_all(response.as_bytes()).await.unwrap();
        } else {
            writer.write_all(fmt_error_response(400, "Invalid JSON payload").as_bytes()).await.unwrap();
        }
    } else {
        writer.write_all(fmt_error_response(400, "Missing body").as_bytes()).await.unwrap();
    }
}

async fn handle_get(request: &str, writer: &mut (impl AsyncWriteExt + Unpin), store: Arc<RwLock<ImageStore>>) {
    let id = request
        .split_whitespace()
        .nth(1)
        .and_then(|path| path.strip_prefix("/images/"))
        .and_then(|id| serde_json::from_str::<ImageId>(id).ok());

    if let Some(image_id) = id {
        let guard = store.read().await;
        if let Some(image) = guard.get(image_id) {
            let response_body = json!(image);
            let response = format!(
                "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{}",
                response_body
            );
            writer.write_all(response.as_bytes()).await.unwrap();
        } else {
            writer.write_all(fmt_error_response(404, "Image not found").as_bytes()).await.unwrap();
        }
    } else {
        writer.write_all(fmt_error_response(404, "Invalid image ID").as_bytes()).await.unwrap();
    }
}

async fn handle_update(request: &str, writer: &mut (impl AsyncWriteExt + Unpin), store: Arc<RwLock<ImageStore>>) {
    let id = request
        .split_whitespace()
        .nth(1)
        .and_then(|path| path.strip_prefix("/images/"))
        .and_then(|id| serde_json::from_str::<ImageId>(id).ok());

    if let Some(image_id) = id {
        if let Some(body_start) = request.find("\r\n\r\n") {
            let body = &request[body_start + 4..];

            if let Ok(patch) = serde_json::from_str::<ImagePatch>(body) {
                let mut guard = store.write().await;

                if let Some(image) = guard.get_mut(image_id) {

                    if let Some(title) = &patch.title {
                        image.title = title.clone();
                    }
                    if let Some(description) = &patch.description {
                        image.description = description.clone();
                    }
                    if let Some(status) = &patch.status {
                        image.status = status.clone();
                    }
                

                    let response_body = json!({
                        "status": "success",
                        "updated_image": image,
                    });

                    let response = format!(
                        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{}",
                        response_body
                    );
                    writer.write_all(response.as_bytes()).await.unwrap();
                } else {
                    writer.write_all(fmt_error_response(404, "Image not found").as_bytes()).await.unwrap();
                }
            } else {
                writer.write_all(fmt_error_response(400, "Invalid JSON payload").as_bytes()).await.unwrap();
            }
        } else {
            writer.write_all(fmt_error_response(400, "Missing body").as_bytes()).await.unwrap();
        }
    } else {
        writer.write_all(fmt_error_response(400, "Invalid image ID").as_bytes()).await.unwrap();
    }
}
