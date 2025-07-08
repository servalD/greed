CREATE TABLE user_apartment (
    user_id INT NOT NULL REFERENCES users(id),
    apartment_id INT NOT NULL REFERENCES apartments(id),
    part DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (user_id, apartment_id)
);
