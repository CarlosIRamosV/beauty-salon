CREATE TABLE jwt
(
    id         VARCHAR   NOT NULL,
    user_id    VARCHAR   NOT NULL REFERENCES users (id),
    token      VARCHAR   NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (token, id)
);