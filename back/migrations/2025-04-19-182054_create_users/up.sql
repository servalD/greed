-- Active: 1745172809718@@localhost@5432@greed
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    eth_address TEXT UNIQUE,
    password_hash TEXT NOT NULL
);
