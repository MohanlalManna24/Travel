-- ============================================================================
-- SCHEMA: 005_notifications.sql
-- DESCRIPTION: Notifications, Customer Inquiries & Alerts Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    notification_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category ENUM('Inquiry', 'Booking', 'Feedback', 'System', 'Alert', 'Promotional') NOT NULL DEFAULT 'Inquiry',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Associated User & Customer Snapshot
    user_id BIGINT UNSIGNED NULL,
    user_name VARCHAR(150) NULL,
    user_email VARCHAR(150) NULL,
    user_phone VARCHAR(50) NULL,
    user_avatar VARCHAR(300) NULL,
    user_role VARCHAR(50) NULL DEFAULT 'Traveler',
    
    -- Linked Entity (Trip / Booking / System)
    entity_type VARCHAR(50) NULL,
    entity_id VARCHAR(100) NULL,
    entity_name VARCHAR(200) NULL,
    
    -- Admin Reply / Resolution Details
    reply_sent_at DATETIME NULL,
    reply_channel VARCHAR(50) NULL,
    reply_subject VARCHAR(255) NULL,
    reply_message TEXT NULL,
    replied_by VARCHAR(100) NULL DEFAULT 'Administrator',
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    
    -- Performance Indexes
    INDEX idx_notification_code (notification_code),
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

