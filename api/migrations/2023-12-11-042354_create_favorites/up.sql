CREATE TABLE favorites (
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    product_id VARCHAR NOT NULL REFERENCES products(id),
    PRIMARY KEY (id)
)