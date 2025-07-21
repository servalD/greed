CREATE TYPE role AS ENUM ('guest', 'agency', 'agent', 'client', 'co_owner', 'admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    eth_address TEXT NOT NULL UNIQUE,
    role role NOT NULL
);
