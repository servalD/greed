CREATE TABLE realties (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(id), -- promoter
    street_number TEXT NOT NULL,
    street_name TEXT NOT NULL,
    complement_address TEXT,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    image_url TEXT NOT NULL
);
