CREATE TABLE users
(
    id         VARCHAR   NOT NULL PRIMARY KEY,
    name       VARCHAR   NOT NULL,
    last_name  VARCHAR   NOT NULL,
    birth_date DATE      NOT NULL,
    sex        VARCHAR   NOT NULL,
    phone      VARCHAR   NOT NULL,
    email      VARCHAR   NOT NULL,
    password   VARCHAR   NOT NULL
);