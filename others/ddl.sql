/**
db is hosted on planetscale
each table require PK in pscale
**/

CREATE DATABASE IF NOT EXISTS accountvault;
USE accountvault;

DROP TABLE IF EXISTS account;
CREATE TABLE account (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255),
    email VARCHAR(255),
    hash_pwd VARCHAR(255),
    verified DATETIME,
    login_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

-- status: 0 unused, 1 used, 2 invalid
DROP TABLE IF EXISTS verification;
CREATE TABLE verification (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    verification_code INT NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user_session;
CREATE TABLE user_session (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);