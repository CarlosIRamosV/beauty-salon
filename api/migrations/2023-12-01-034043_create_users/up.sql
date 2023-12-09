CREATE TABLE users
(
    id            VARCHAR NOT NULL,
    type          VARCHAR NOT NULL,
    image_id      VARCHAR REFERENCES images (id),
    name          VARCHAR NOT NULL,
    last_name     VARCHAR NOT NULL,
    birth_date    DATE    NOT NULL,
    sex           VARCHAR NOT NULL,
    phone         VARCHAR NOT NULL,
    email         VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email),
    CHECK (type IN ('User', 'Employee', 'Admin')),
    CHECK (sex IN ('Male', 'Female', 'Other'))
);