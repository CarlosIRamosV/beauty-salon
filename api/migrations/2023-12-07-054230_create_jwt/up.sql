CREATE TABLE jwt
(
    id              VARCHAR NOT NULL,
    user_id         VARCHAR NOT NULL REFERENCES users (id),
    token           VARCHAR NOT NULL,
    expiration_date DATE    NOT NULL,
    PRIMARY KEY (id)
)