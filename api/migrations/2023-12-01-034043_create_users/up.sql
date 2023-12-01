CREATE TABLE users
(
    id         VARCHAR NOT NULL,
    role_id    INT     NOT NULL REFERENCES roles (id),
    name       VARCHAR NOT NULL,
    last_name  VARCHAR NOT NULL,
    birth_date DATE    NOT NULL,
    sex_id     INT     NOT NULL REFERENCES sex (id),
    phone      VARCHAR NOT NULL,
    email      VARCHAR NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (phone, email)
);

INSERT INTO users (ID, ROLE_ID, NAME, LAST_NAME, BIRTH_DATE, SEX_ID, PHONE, EMAIL)
VALUES ('56b70053-a5d8-4057-b41f-ebb994576df1', '1', 'admin', 'admin', '1990-01-01', '1', '123456789',
        'admin@admin.com');