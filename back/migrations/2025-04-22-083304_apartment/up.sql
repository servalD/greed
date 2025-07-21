CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    realty_id INT NOT NULL REFERENCES realties(id),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL
);
