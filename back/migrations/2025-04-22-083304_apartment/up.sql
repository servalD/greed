CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    realty_id INT NOT NULL REFERENCES realties(id),
    name TEXT NOT NULL,
    street_number TEXT NOT NULL,
    street_name TEXT NOT NULL,
    complement_address TEXT,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL
);
