CREATE TABLE passwords
(
    user_id VARCHAR NOT NULL REFERENCES users(id),
    password VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO passwords (user_id, password) VALUES ('56b70053-a5d8-4057-b41f-ebb994576df1', 'admin');
