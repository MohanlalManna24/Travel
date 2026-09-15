CREATE Table users_address (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    address_line1 VARCHAR(200) not NULL,
    address_line2 VARCHAR(200),
    city VARCHAR(100) not NULL,
    state VARCHAR(100) not NULL,
    pin_code VARCHAR(20) not NULL,
    country VARCHAR(100) not NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) on DELETE CASCADE,
    index idx_user_id (user_id)
)