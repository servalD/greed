CREATE TYPE role AS ENUM ('admin', 'agent', 'client', 'guest');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    eth_address TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    role role NOT NULL
);
