CREATE TABLE users
(
    id         VARCHAR NOT NULL,
    type    VARCHAR     NOT NULL,
    name       VARCHAR NOT NULL,
    last_name  VARCHAR NOT NULL,
    birth_date DATE    NOT NULL,
    sex        VARCHAR NOT NULL,
    phone      VARCHAR NOT NULL,
    email      VARCHAR NOT NULL,
    password   VARCHAR NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email),
    CHECK (type IN ('User', 'Employee', 'Admin')),
    CHECK (sex IN ('Male', 'Female', 'Other'))
);

INSERT INTO users (ID, type, NAME, LAST_NAME, BIRTH_DATE, SEX, PHONE, EMAIL, PASSWORD)
VALUES ('56b70053-a5d8-4057-b41f-ebb994576df1', 'Admin', 'admin', 'admin', '1990-01-01', 'Other', '123456789',
        'admin@admin.com', '123456789');