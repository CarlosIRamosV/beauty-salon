CREATE TABLE images
(
    id     VARCHAR NOT NULL PRIMARY KEY,
    format VARCHAR NOT NULL,
    data   BLOB    NOT NULL
)