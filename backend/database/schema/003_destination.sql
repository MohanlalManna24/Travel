CREATE TABLE destinations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image VARCHAR(300) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    state VARCHAR(100),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    price BIGINT UNSIGNED NOT NULL,
    days INT not NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_destination_status (status)
);