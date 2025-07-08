CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    apartment_id INT NOT NULL REFERENCES apartments(id),
    name TEXT NOT NULL,
    address TEXT NOT NULL
);
