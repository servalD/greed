CREATE TABLE realties (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(id), -- promoter
    address TEXT NOT NULL
);
