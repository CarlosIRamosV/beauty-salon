CREATE TABLE products
(
    id          VARCHAR NOT NULL PRIMARY KEY,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    price       DECIMAL NOT NULL,
    stock       INTEGER NOT NULL,
    image_id    VARCHAR REFERENCES images (id)
);