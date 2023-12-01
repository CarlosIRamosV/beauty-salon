CREATE TABLE products
(
    id          VARCHAR NOT NULL PRIMARY KEY,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    price       DECIMAL NOT NULL,
    quantity    INTEGER NOT NULL,
    image       VARCHAR NOT NULL
);