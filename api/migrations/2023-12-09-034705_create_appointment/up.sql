CREATE TABLE appointments
(
    id          VARCHAR NOT NULL,
    client_id   VARCHAR NOT NULL REFERENCES users (id),
    services    VARCHAR NOT NULL,
    employee_id VARCHAR NOT NULL REFERENCES users (id),
    date        DATE NOT NULL,
    PRIMARY KEY (id)
);
