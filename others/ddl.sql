/**
db is hosted on planetscale
each table require PK in pscale
**/

CREATE DATABASE IF NOT EXISTS account_vault;
USE account_vault;

CREATE TABLE IF NOT EXISTS accounts (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255),
    email VARCHAR(255),
    hash_pwd VARCHAR,
    verified DATETIME,
    login_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

-- status: 0 unused, 1 used, 2 invalid
CREATE TABLE IF NOT EXISTS verification (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    verification_code INT NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_session (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);