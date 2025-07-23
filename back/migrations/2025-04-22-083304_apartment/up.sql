CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    realty_id INT NOT NULL REFERENCES realties(id),
    token_id INT NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL
);
