CREATE TABLE realties (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    street_number TEXT NOT NULL,
    street_name TEXT NOT NULL,
    complement_address TEXT,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    promoter INT NOT NULL REFERENCES users(id),
    image_url TEXT NOT NULL,
    apartment_count INT NOT NULL
);
