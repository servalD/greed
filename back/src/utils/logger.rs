use chrono::Local;
use std::fs::OpenOptions;
use std::io::Write;
use std::sync::Mutex;
use std::env;

#[derive(PartialEq, PartialOrd)]
enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
}

impl LogLevel {
    fn from_str(s: &str) -> Self {
        match s.to_uppercase().as_str() {
            "DEBUG" => LogLevel::Debug,
            "INFO" => LogLevel::Info,
            "WARNING" => LogLevel::Warning,
            "ERROR" => LogLevel::Error,
            _ => LogLevel::Info,
        }
    }
}

lazy_static::lazy_static! {
    static ref LOG_FILE: Mutex<Option<std::fs::File>> = Mutex::new(None);
    static ref ACTIVE_LEVEL: LogLevel = {
        let val = env::var("LOG_LEVEL").unwrap_or_else(|_| "INFO".into());
        LogLevel::from_str(&val)
    };
}

pub fn init_logger(file_path: Option<&str>) {
    dotenv::dotenv().ok();
    if let Some(path) = file_path {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)
            .expect("Impossible d'ouvrir le fichier de log");
        *LOG_FILE.lock().unwrap() = Some(file);
    }
}

fn format_message(level: &str, message: &str) -> String {
    let now = Local::now().format("%Y-%m-%d %H:%M:%S");
    format!("[{}][{}] {}", now, level, message)
}

fn write(level: LogLevel, label: &str, message: &str, is_err: bool) {
    if level >= *ACTIVE_LEVEL {
        let formatted = format_message(label, message);
        if is_err {
            eprintln!("{}", formatted);
        } else {
            println!("{}", formatted);
        }
        write_to_file(&formatted);
    }
}

fn write_to_file(message: &str) {
    if let Some(ref mut file) = *LOG_FILE.lock().unwrap() {
        let _ = writeln!(file, "{}", message);
    }
}

pub fn debug(msg: &str) {
    write(LogLevel::Debug, "DEBUG", msg, false);
}

pub fn info(msg: &str) {
    write(LogLevel::Info, "INFO", msg, false);
}

pub fn warning(msg: &str) {
    write(LogLevel::Warning, "WARNING", msg, false);
}

pub fn error(msg: &str) {
    write(LogLevel::Error, "ERROR", msg, true);
}
