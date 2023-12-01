CREATE TABLE roles
(
    id          INT     NOT NULL PRIMARY KEY,
    description VARCHAR NOT NULL
);

INSERT INTO roles (id, description)
VALUES (1, 'Administrator'),
       (2, 'Empleado'),
       (3, 'Cliente');
