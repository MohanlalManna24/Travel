CREATE Table users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) not NULL,
    email VARCHAR(100) not NULL UNIQUE,
    phone BIGINT not NULL UNIQUE,
    password VARCHAR(200) not NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    index idx_email (email),
    index idx_phone (phone)
)