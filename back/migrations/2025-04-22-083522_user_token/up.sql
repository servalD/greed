CREATE TABLE user_token (
    user_id INT NOT NULL REFERENCES users(id),
    token_id INT NOT NULL REFERENCES tokens(id),
    supply BIGINT NOT NULL,
    PRIMARY KEY (user_id, token_id)
);
