-- ============================================================================
-- SCHEMA: 004_bookings.sql
-- DESCRIPTION: Booking Management Schema for Travel Website
-- ============================================================================

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NULL,
    destination_id BIGINT UNSIGNED NULL,
    
    -- Customer Details (stores snapshot even if user is not registered or updated)
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NULL,
    customer_city VARCHAR(100) NULL,
    customer_avatar VARCHAR(300) NULL,
    
    -- Destination Snapshot
    destination_name VARCHAR(150) NOT NULL,
    destination_location VARCHAR(150) NULL,
    destination_image VARCHAR(300) NULL,
    
    -- Trip Schedule & Party
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guests INT UNSIGNED NOT NULL DEFAULT 1,
    
    -- Pricing & Financials
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Pending', 'Paid', 'Refunded', 'Failed') NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(100) NULL DEFAULT 'Credit Card',
    transaction_id VARCHAR(100) NULL,
    
    -- Booking Lifecycle Status
    booking_status ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
    special_notes TEXT NULL,
    
    -- Audit Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_booking_destination FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE SET NULL,
    
    -- Indexes for fast search, filter & sort queries
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_customer_email (customer_email),
    INDEX idx_booking_status (booking_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_trip_dates (start_date, end_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
