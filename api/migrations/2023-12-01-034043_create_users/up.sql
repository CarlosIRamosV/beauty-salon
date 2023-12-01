CREATE TABLE users
(
    id         VARCHAR NOT NULL PRIMARY KEY,
    role_id    INT     NOT NULL REFERENCES roles (id),
    name       VARCHAR NOT NULL,
    last_name  VARCHAR NOT NULL,
    birth_date DATE    NOT NULL,
    sex_id     INT     NOT NULL REFERENCES sex (id),
    phone      VARCHAR NOT NULL UNIQUE,
    email      VARCHAR NOT NULL UNIQUE,
    password   VARCHAR NOT NULL
);

INSERT INTO users (ID, ROLE_ID, NAME, LAST_NAME, BIRTH_DATE, SEX_ID, PHONE, EMAIL, PASSWORD) VALUES ('1', '1', 'admin', 'admin', '1990-01-01', '1', '123456789', 'admin@admin.com', 'admin');